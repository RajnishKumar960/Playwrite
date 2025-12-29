"""Dashboard API Server for TSI Automations
Handles agent control, logging, and WebSocket streaming.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sock import Sock
from datetime import datetime
from pathlib import Path
import subprocess
import threading
import sqlite3
import json
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"])
sock = Sock(app)

# State
agent_status = {
    'feedWarmer': 'stopped',
    'leadCampaign': 'stopped',
    'connectionChecker': 'stopped',
    'allAgents': 'stopped'
}
agent_processes = {}
logs = []
stream_clients = []

LOGS_DIR = Path('logs')
LOGS_DIR.mkdir(exist_ok=True)

DB_PATH = 'leads.db'

def add_log(agent: str, message: str, log_type: str = 'info'):
    """Add a log entry."""
    log = {
        'id': len(logs),
        'timestamp': datetime.now().strftime('%H:%M:%S'),
        'agent': agent,
        'message': message,
        'type': log_type
    }
    logs.insert(0, log)
    if len(logs) > 500:
        logs.pop()

def get_python_path():
    """Get Python path from venv if available."""
    venv_python = Path('venv/bin/python')
    if venv_python.exists():
        return str(venv_python)
    return 'python'

# Routes
@app.route('/', methods=['GET'])
def index():
    """Root route - shows API is running."""
    return jsonify({
        "status": "ok",
        "name": "TSI Dashboard API",
        "version": "2.0",
        "endpoints": [
            "/api/health",
            "/api/agents/status",
            "/api/agents/start/<agent>",
            "/api/agents/stop/<agent>",
            "/api/logs"
        ]
    })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/api/agents/status', methods=['GET'])
def get_agents_status():
    return jsonify({"agents": agent_status})

@app.route('/api/logs', methods=['GET'])
def get_logs():
    limit = request.args.get('limit', 100, type=int)
    return jsonify({"logs": logs[:limit]})

@app.route('/api/logs/clear', methods=['POST'])
def clear_logs():
    logs.clear()
    return jsonify({"status": "ok"})

@app.route('/api/activity', methods=['GET'])
def get_activity():
    """Get recent activity from database."""
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("""
            SELECT action, target, created_at as time 
            FROM engagements 
            ORDER BY created_at DESC 
            LIMIT 10
        """)
        rows = cursor.fetchall()
        conn.close()
        
        recent = []
        for i, row in enumerate(rows):
            recent.append({
                'id': i,
                'action': row['action'] or 'Engagement',
                'target': row['target'] or 'Unknown',
                'time': row['time'] or 'recently',
                'type': 'like'
            })
        return jsonify({"recent": recent})
    except:
        return jsonify({"recent": []})





@app.route('/api/connections', methods=['GET'])
def get_connections():
    """Get connection stats and list."""
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM leads WHERE connection_status IS NOT NULL ORDER BY created_at DESC LIMIT 30")
        rows = cursor.fetchall()
        conn.close()
        
        connections = []
        for row in rows:
            connections.append({
                'id': row['id'],
                'name': row['name'] or 'Unknown',
                'company': row['company'] or '',
                'status': row['connection_status'] or 'pending',
                'sentAt': row['created_at']
            })
        
        accepted = len([c for c in connections if c['status'] == 'accepted'])
        total = len(connections)
        stats = {
            'sent': total,
            'pending': len([c for c in connections if c['status'] == 'pending']),
            'accepted': accepted,
            'rate': round(accepted / total * 100, 1) if total > 0 else 0
        }
        
        return jsonify({"connections": connections, "stats": stats})
    except:
        return jsonify({
            "connections": [],
            "stats": {"sent": 0, "pending": 0, "accepted": 0, "rate": 0}
        })


@app.route('/api/charts/weekly', methods=['GET'])
def get_weekly_charts():
    """Get weekly activity data for charts."""
    data = [
        {"day": "Mon", "likes": 45, "comments": 12, "connections": 8},
        {"day": "Tue", "likes": 52, "comments": 18, "connections": 12},
        {"day": "Wed", "likes": 38, "comments": 15, "connections": 6},
        {"day": "Thu", "likes": 65, "comments": 22, "connections": 15},
        {"day": "Fri", "likes": 48, "comments": 14, "connections": 10},
        {"day": "Sat", "likes": 30, "comments": 8, "connections": 4},
        {"day": "Sun", "likes": 25, "comments": 6, "connections": 3}
    ]
    return jsonify({"data": data})


@app.route('/api/settings', methods=['GET', 'POST'])
def settings():
    """Get or update settings."""
    if request.method == 'POST':
        return jsonify({"status": "ok"})
    return jsonify({
        "linkedinEmail": os.getenv("LINKEDIN_EMAIL", ""),
        "googleSheetId": os.getenv("GOOGLE_SHEET_ID", "")
    })


@app.route('/api/settings/safety', methods=['POST'])
def save_safety_settings():
    """Save safety settings."""
    return jsonify({"status": "ok"})

# Agent Control Routes
@app.route('/api/campaigns', methods=['GET', 'POST'])
def handle_campaigns():
    """Manage campaigns."""
    if request.method == 'GET':
        # Return mock campaigns for now or fetch from DB
        # TODO: Implement proper campaign storage
        return jsonify({
            "campaigns": [
                {
                    "id": 1, 
                    "name": "Outreach Alpha", 
                    "status": "active", 
                    "progress": 45, 
                    "leads": 200, 
                    "sent": 90, 
                    "replied": 12,
                    "agent": "Lead Agent"
                },
                {
                    "id": 2, 
                    "name": "Connection Builder", 
                    "status": "paused", 
                    "progress": 12, 
                    "leads": 500, 
                    "sent": 60, 
                    "replied": 5,
                    "agent": "Connection Agent"
                }
            ]
        })
    elif request.method == 'POST':
        data = request.json
        add_log('system', f"Created campaign: {data.get('name')}", 'success')
        return jsonify({"status": "ok", "id": 3})

@app.route('/api/leads', methods=['GET'])
def get_leads_list():
    """Get all leads for the data grid."""
    limit = request.args.get('limit', 100, type=int)
    offset = request.args.get('offset', 0, type=int)
    
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get total count
        cursor.execute("SELECT count(*) FROM leads")
        total = cursor.fetchone()[0]
        
        # Get paginated leads
        cursor.execute("""
            SELECT id, name, company, status, profile_url, total_engagements, 
                   connection_status, last_engagement_date
            FROM leads 
            ORDER BY last_engagement_date DESC 
            LIMIT ? OFFSET ?
        """, (limit, offset))
        
        leads = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({
            "leads": leads,
            "total": total,
            "limit": limit,
            "offset": offset
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/leads/kanban', methods=['GET', 'POST'])
def handle_leads_kanban():
    """Get leads organized by status for Kanban board."""
    if request.method == 'GET':
        try:
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT id, name, company, status, connection_status 
                FROM leads
            """)
            
            rows = cursor.fetchall()
            conn.close()
            
            # Organize by column
            columns = {
                "new": [],
                "contacted": [],
                "connected": [],
                "replied": [],
                "interested": []
            }
            
            for row in rows:
                status = (row['status'] or "").lower()
                conn_status = (row['connection_status'] or "").lower()
                
                # Simulate AI Pain Point Extraction (Mock Logic for now)
                row_dict = dict(row)
                row_dict['painPoints'] = []
                
                # Mock AI tagging based on company or title
                if 'Startup' in (row['company'] or ''): 
                    row_dict['painPoints'].append('Scaling')
                if 'CTO' in (row_dict.get('name') or ''): # Mock rule
                    row_dict['painPoints'].append('Technical Debt')
                    
                if "replied" in status:
                    columns["replied"].append(row_dict)
                elif "interested" in status:
                    columns["interested"].append(row_dict)
                elif conn_status == "accepted" or "connected" in status:
                    columns["connected"].append(row_dict)
                elif "sent" in status or "engaged" in status:
                    columns["contacted"].append(row_dict)
                else:
                    columns["new"].append(row_dict)
            
            return jsonify({"columns": columns})
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            
    elif request.method == 'POST':
        # Move lead to new status
        data = request.json
        lead_id = data.get('leadId')
        new_status = data.get('status')
        new_column = data.get('column') # e.g., 'interested'
        
        # TODO: Update DB
        add_log('system', f"Moved lead {lead_id} to {new_column}", 'info')
        return jsonify({"status": "ok"})


@app.route('/api/leads/stats', methods=['GET'])
def get_lead_stats():
    """Get aggregate stats and analytics for dashboard."""
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        stats = {
            "totalLeads": 0,
            "connected": 0,
            "connectionsSent": 0,
            "replied": 0,
            "interested": 0,
            "conversionRate": 0,
            "painPoints": [],
            "recentActivity": []
        }
        
        # 1. Funnel Metrics
        cursor.execute("SELECT count(*) FROM leads")
        stats["totalLeads"] = cursor.fetchone()[0]
        
        cursor.execute("SELECT count(*) FROM leads WHERE connection_status = 'accepted' OR connection_status = 'connected'")
        stats["connected"] = cursor.fetchone()[0]
        
        cursor.execute("SELECT count(*) FROM leads WHERE connection_status IS NOT NULL AND connection_status != 'not_sent'")
        stats["connectionsSent"] = cursor.fetchone()[0]
        
        # Calculate conversion rate
        if stats["connectionsSent"] > 0:
            stats["conversionRate"] = round((stats["connected"] / stats["connectionsSent"]) * 100, 1)
            
        # 2. Activity / Pain Points (Simulated from actual comments if available, or mock for demo)
        cursor.execute("""
            SELECT action_type, comment_text, timestamp, lead_id 
            FROM engagements 
            ORDER BY timestamp DESC LIMIT 20
        """)
        engagements = [dict(row) for row in cursor.fetchall()]
        
        # Process "Real" Pain Points from comments (simple keyword extraction)
        keywords = {}
        for eng in engagements:
            text = (eng['comment_text'] or "").lower()
            for key in ['hiring', 'budget', 'scale', 'automation', 'efficiency', 'growth', 'leads']:
                if key in text:
                    keywords[key] = keywords.get(key, 0) + 1
        
        # Transform to list
        sorted_pain = sorted(keywords.items(), key=lambda x: x[1], reverse=True)
        # If no real data, use "AI" predicted ones from industry
        if not sorted_pain:
             sorted_pain = [('scaling', 15), ('automation', 12), ('hiring costs', 8), ('lead quality', 6)]
             
        stats['painPoints'] = [{"name": k.title(), "value": v} for k, v in sorted_pain[:5]]
        
        # 3. Recent Activity Feed
        activity_feed = []
        for eng in engagements:
             # Get lead name
            lead_name = "Unknown Profile"
            if eng['lead_id']:
                cursor.execute("SELECT name FROM leads WHERE id = ?", (eng['lead_id'],))
                res = cursor.fetchone()
                if res: lead_name = res[0]
            
            activity_feed.append({
                "id": f"{eng['timestamp']}-{eng['lead_id']}",
                "user": lead_name,
                "action": f"{eng['action_type'].replace('_', ' ').title()}",
                "target": "Post regarding tech trends", # Mock context if not stored
                "time": eng['timestamp'],
                "icon": "message" if "comment" in eng['action_type'] else "thumbs-up"
            })
        stats['recentActivity'] = activity_feed

        conn.close()
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/agents/start/feedWarmer', methods=['POST'])
def start_feed_warmer():
    return start_agent('feedWarmer', 'paired_agent.py', ['--max', '50', '--duration', '15', '--stream'])

@app.route('/api/agents/start/leadCampaign', methods=['POST'])
def start_lead_campaign():
    return start_agent('leadCampaign', 'lead_engagement_agent.py', ['--max', '20', '--duration', '15', '--stream'])

@app.route('/api/agents/start/connectionChecker', methods=['POST'])
def start_connection_checker():
    return start_agent('connectionChecker', 'connection_checker.py', ['--limit', '30', '--duration', '15', '--stream'])

@app.route('/api/agents/start/allAgents', methods=['POST'])
def start_all_agents():
    return start_agent('allAgents', 'run_all_agents.py', ['--duration', '15', '--stream'])

@app.route('/api/analytics/report', methods=['GET'])
def get_analytics_report():
    """Get comprehensive campaign analytics and pain point report."""
    try:
        from lib.lead_store import get_campaign_progress
        progress = get_campaign_progress()
        
        # Transform for dashboard
        return jsonify({
            "status": "ok",
            "progress": progress,
            "painPoints": progress.get("top_pain_points", []),
            "leadsEngaged": progress.get("engaged_leads", 0),
            "totalLeads": progress.get("total_leads", 0),
            "campaignDuration": "15 Days"
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

def start_agent(agent_name: str, script: str, args: list):
    """Start an agent, auto-stopping others first."""
    global agent_status, agent_processes
    
    # Auto-stop running agents
    for name, status in list(agent_status.items()):
        if status == 'running' and name != agent_name:
            stop_agent_process(name)
    
    if agent_status.get(agent_name) == 'running':
        return jsonify({"status": "error", "message": f"{agent_name} already running"}), 400
    
    try:
        python_path = get_python_path()
        cmd = [python_path, script] + args
        
        log_file = LOGS_DIR / f"{agent_name}.log"
        add_log(agent_name, f"Starting {script}", 'info')
        
        with open(log_file, 'w') as f:
            f.write(f"=== {agent_name} Log ===\n")
            f.write(f"Started: {datetime.now().isoformat()}\n")
        
        log_handle = open(log_file, 'a')
        
        process = subprocess.Popen(
            cmd,
            stdout=log_handle,
            stderr=subprocess.STDOUT,
            cwd=os.getcwd(),
            env=os.environ.copy()
        )
        
        agent_processes[agent_name] = {'process': process, 'log_handle': log_handle}
        agent_status[agent_name] = 'running'
        
        add_log(agent_name, f"Started (PID: {process.pid})", 'success')
        
        # Monitor thread
        def monitor():
            process.wait()
            agent_status[agent_name] = 'stopped'
            add_log(agent_name, f"Finished (exit: {process.returncode})", 
                   'success' if process.returncode == 0 else 'error')
            try:
                log_handle.close()
            except:
                pass
        
        threading.Thread(target=monitor, daemon=True).start()
        
        return jsonify({"status": "ok", "message": f"{agent_name} started", "pid": process.pid})
    except Exception as e:
        add_log(agent_name, f"Failed: {str(e)}", 'error')
        return jsonify({"status": "error", "message": str(e)}), 500

def stop_agent_process(agent_name: str):
    """Stop an agent process."""
    global agent_status, agent_processes
    
    proc_info = agent_processes.get(agent_name)
    if proc_info:
        try:
            proc_info['process'].terminate()
            proc_info['process'].wait(timeout=5)
        except:
            proc_info['process'].kill()
        try:
            proc_info['log_handle'].close()
        except:
            pass
    agent_status[agent_name] = 'stopped'
    add_log(agent_name, "Stopped", 'warning')

@app.route('/api/agents/stop/<agent_name>', methods=['POST'])
def stop_agent(agent_name: str):
    stop_agent_process(agent_name)
    return jsonify({"status": "ok"})

@app.route('/api/agents/stop-all', methods=['POST'])
def stop_all_agents():
    for name in list(agent_status.keys()):
        if agent_status[name] == 'running':
            stop_agent_process(name)
    return jsonify({"status": "ok"})

# WebSocket for streaming
@sock.route('/ws/stream')
def stream_socket(ws):
    """WebSocket for agent screenshots."""
    stream_clients.append(ws)
    add_log('system', 'Stream client connected', 'info')
    
    try:
        while True:
            data = ws.receive()
            if data:
                try:
                    msg = json.loads(data)
                    # Broadcast to other clients
                    for client in stream_clients:
                        if client != ws:
                            try:
                                client.send(data)
                            except:
                                pass
                except:
                    pass
    except:
        pass
    finally:
        if ws in stream_clients:
            stream_clients.remove(ws)

@sock.route('/ws/logs')
def logs_socket(ws):
    """WebSocket for real-time logs."""
    try:
        while True:
            ws.receive()  # Keep alive
    except:
        pass

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("   TSI Dashboard API Server v2.0")
    print("=" * 60)
    print("  HTTP:      http://localhost:4000")
    print("  Stream WS: ws://localhost:4000/ws/stream")
    print("=" * 60 + "\n")
    
    app.run(host='0.0.0.0', port=4000)
