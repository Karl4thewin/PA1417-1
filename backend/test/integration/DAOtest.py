import pytest
from pymongo import MongoClient
from src.util.dao import DAO

@pytest.fixture(scope="module")
def dao():
    client = MongoClient("mongodb://localhost:27017/")
    test_db = client["test_edutask_integration"]

    # Drop the test database to ensure a clean state
    client.drop_database("test_edutask_integration")

    # This fixture initializes DAO for each type of collection to test different validators
    yield {
        'task': DAO("task"),
        'todo': DAO("todo"),
        'user': DAO("user"),
        'video': DAO("video")
    }
    # Teardown: drop the test database after tests
    client.drop_database("test_edutask_integration")

def test_valid_insertion(dao):
    """Test inserting valid items according to their validators."""
    task_data = {"title": "Project Plan", "description": "Plan the project phases"}
    todo_data = {"description": "Buy milk", "done": False}
    user_data = {"firstName": "John", "lastName": "Doe", "email": "john.doe@example.com"}
    video_data = {"url": "http://youtube.com/watch?v=abc123"}

    assert dao['task'].create(task_data) is not None
    assert dao['todo'].create(todo_data) is not None
    assert dao['user'].create(user_data) is not None
    assert dao['video'].create(video_data) is not None

def test_missing_required_fields(dao):
    """Test errors when required fields are missing."""
    with pytest.raises(Exception):
        dao['todo'].create({"done": True})  # Missing description
    with pytest.raises(Exception):
        dao['user'].create({"firstName": "John"})  # Missing lastName and email
    with pytest.raises(Exception):
        dao['video'].create({})  # Missing url

def test_type_mismatch(dao):
    """Test type mismatches against validators."""
    with pytest.raises(Exception):
        dao['todo'].create({"description": 12345, "done": "nope"})  # Wrong types

def test_unique_constraint(dao):
    """Test unique constraint violations."""
    user_data = {"firstName": "Jane", "lastName": "Doe", "email": "jane.doe@example.com"}
    dao['user'].create(user_data)  # First insertion
    with pytest.raises(Exception):
        dao['user'].create(user_data)  # Duplicate email