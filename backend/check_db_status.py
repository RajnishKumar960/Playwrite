import sqlite3
import os

DB_PATH = 'tsi_leads.db'

def check_db():
    if not os.path.exists(DB_PATH):
        print(f"Database {DB_PATH} not found.")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT count(*) FROM leads")
        leads_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT count(*) FROM engagements")
        engagements_count = cursor.fetchone()[0]
        
        print(f"Leads Count: {leads_count}")
        print(f"Engagements Count: {engagements_count}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_db()
