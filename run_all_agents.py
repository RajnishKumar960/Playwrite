#!/usr/bin/env python3
"""Run All Agents Concurrently

This script runs all 3 LinkedIn automation agents in parallel:
1. Paired Agent - Feed engagement (like/comment on 1st-degree posts)
2. Lead Agent - 15-day campaign (visit leads, engage, track pain points)
3. Connection Agent - Check pending connection request status

Usage:
    python run_all_agents.py --duration 15 --headful
    
Each agent runs for the specified duration (default: 15 minutes) concurrently.
"""

import subprocess
import sys
import os
import time
import signal
from datetime import datetime
from pathlib import Path

# Create logs directory if it doesn't exist
LOGS_DIR = Path("logs")
LOGS_DIR.mkdir(exist_ok=True)


def run_agent(name: str, command: list, log_file: Path):
    """Start an agent subprocess with logging."""
    print(f"  Starting {name}...")
    
    with open(log_file, "w") as f:
        f.write(f"=== {name} Log ===\n")
        f.write(f"Started: {datetime.now().isoformat()}\n")
        f.write(f"Command: {' '.join(command)}\n")
        f.write("=" * 60 + "\n\n")
    
    # Open log file for appending
    log_handle = open(log_file, "a")
    
    process = subprocess.Popen(
        command,
        stdout=log_handle,
        stderr=subprocess.STDOUT,
        cwd=os.getcwd(),
        env=os.environ.copy()
    )
    
    return process, log_handle


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Run all LinkedIn agents concurrently")
    parser.add_argument(
        "--duration", 
        type=int, 
        default=15, 
        help="Duration in minutes for each agent (default: 15)"
    )
    parser.add_argument(
        "--headful",
        action="store_true",
        help="Run with visible browser windows"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview mode - no actual engagements"
    )
    args = parser.parse_args()
    
    duration = args.duration
    headful_flag = "--headful" if args.headful else ""
    dry_run_flag = "--dry-run" if args.dry_run else ""
    
    print("\n" + "=" * 60)
    print("   Running All LinkedIn Agents Concurrently")
    print("=" * 60)
    print(f"  Duration: {duration} minutes each")
    print(f"  Mode: {'VISIBLE' if args.headful else 'HEADLESS'}")
    print(f"  Dry Run: {args.dry_run}")
    print("=" * 60 + "\n")
    
    # Get Python path from virtual environment
    python_path = sys.executable
    
    # Define agents and their commands
    agents = [
        {
            "name": "Paired Agent (Feed Engagement)",
            "command": [
                python_path, "paired_agent.py",
                "--max", "50",  # High number, will be limited by duration
                "--duration", str(duration),
            ],
            "log": LOGS_DIR / "paired_agent.log"
        },
        {
            "name": "Lead Agent (Campaign)",
            "command": [
                python_path, "lead_engagement_agent.py",
                "--max", "20",  # Will be limited by duration
                "--duration", str(duration),
            ],
            "log": LOGS_DIR / "lead_agent.log"
        },
        {
            "name": "Connection Agent (Status Check)",
            "command": [
                python_path, "connection_checker.py",
                "--limit", "30",  # Will be limited by duration
                "--duration", str(duration),
            ],
            "log": LOGS_DIR / "connection_agent.log"
        }
    ]
    
    # Add headful flag if specified
    if args.headful:
        for agent in agents:
            agent["command"].append("--headful")
    
    # Add dry-run flag if specified
    if args.dry_run:
        for agent in agents:
            if agent["name"] != "Connection Agent (Status Check)":  # Connection agent doesn't have dry-run
                agent["command"].append("--dry-run")
    
    processes = []
    log_handles = []
    
    print("Starting agents...")
    start_time = datetime.now()
    
    try:
        # Start all agents
        for agent in agents:
            proc, log = run_agent(agent["name"], agent["command"], agent["log"])
            processes.append({"name": agent["name"], "process": proc, "log_file": agent["log"]})
            log_handles.append(log)
            time.sleep(2)  # Slight delay between starts to avoid browser conflicts
        
        print(f"\n✓ All {len(processes)} agents started!")
        print(f"  Logs: {LOGS_DIR}/")
        print(f"\n  Waiting for completion (max {duration} minutes)...")
        print("  Press Ctrl+C to stop all agents.\n")
        
        # Monitor progress
        check_interval = 30  # seconds
        while True:
            still_running = []
            for p in processes:
                if p["process"].poll() is None:
                    still_running.append(p["name"])
            
            if not still_running:
                print("\n✓ All agents completed!")
                break
            
            elapsed = (datetime.now() - start_time).total_seconds() / 60
            remaining = max(0, duration - elapsed)
            
            if remaining <= 0:
                print(f"\n⏱ Time limit reached. Agents should be stopping...")
                time.sleep(10)  # Give agents time to clean up
                break
            
            print(f"  [{elapsed:.1f}/{duration} min] Running: {', '.join(still_running)}")
            time.sleep(check_interval)
        
    except KeyboardInterrupt:
        print("\n\n⚠ Stopping all agents...")
        for p in processes:
            try:
                p["process"].terminate()
                p["process"].wait(timeout=10)
            except Exception:
                p["process"].kill()
    finally:
        # Close log handles
        for lh in log_handles:
            try:
                lh.close()
            except Exception:
                pass
        
        # Wait for processes to finish
        for p in processes:
            try:
                p["process"].wait(timeout=5)
            except Exception:
                pass
    
    # Print summary
    end_time = datetime.now()
    total_duration = (end_time - start_time).total_seconds() / 60
    
    print("\n" + "=" * 60)
    print("   Agent Run Summary")
    print("=" * 60)
    print(f"  Total Duration: {total_duration:.1f} minutes")
    print(f"  Agents Run: {len(processes)}")
    print("\n  Exit Status:")
    
    for p in processes:
        status = p["process"].returncode
        status_str = "✓ Completed" if status == 0 else f"⚠ Exit code: {status}"
        print(f"    - {p['name']}: {status_str}")
        print(f"      Log: {p['log_file']}")
    
    print("\n" + "=" * 60)
    print("  View logs with: cat logs/<agent_name>.log")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
