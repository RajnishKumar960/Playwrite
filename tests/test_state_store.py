import os
from state_store import init_db, is_processed, mark_processed, list_processed


def test_init_and_mark(tmp_path):
    db = tmp_path / "test_state.db"
    init_db(str(db))
    assert os.path.exists(str(db))
    assert not is_processed('https://linkedin/test-profile', action='send_request', db_path=str(db))
    mark_processed('https://linkedin/test-profile', 'send_request', 'sent', db_path=str(db))
    assert is_processed('https://linkedin/test-profile', action='send_request', db_path=str(db))


def test_list_processed(tmp_path):
    db = tmp_path / "test_state2.db"
    init_db(str(db))
    mark_processed('p1', 'warmup', 'ok', db_path=str(db))
    mark_processed('p2', 'send_request', 'ok', db_path=str(db))
    rows = list_processed(limit=10, db_path=str(db))
    assert len(rows) >= 2
    assert all('profile' in r and 'action' in r for r in rows)
