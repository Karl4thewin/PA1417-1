import pytest
from src.controllers.usercontroller import UserController
from unittest.mock import MagicMock, create_autospec
from src.util.dao import DAO

@pytest.fixture
def user_controller():
    mock_dao = create_autospec(DAO)
    controller = UserController(dao=mock_dao)
    return controller

def test_valid_email_single_user(user_controller):
    user_controller.dao.find.return_value = [{'id': '123', 'email': 'user@example.com'}]
    assert user_controller.get_user_by_email('user@example.com') == {'id': '123', 'email': 'user@example.com'}

def test_valid_email_multiple_users(user_controller, capsys):
    user_controller.dao.find.return_value = [{'id': '123', 'email': 'user@example.com'}, {'id': '124', 'email': 'user@example.com'}]
    user_controller.get_user_by_email('user@example.com')
    captured = capsys.readouterr()
    assert "Error: more than one user found with mail user@example.com" in captured.out

def test_valid_email_no_users(user_controller):
    user_controller.dao.find.return_value = []
    assert user_controller.get_user_by_email('user@example.com') is None

def test_invalid_email_format(user_controller):
    with pytest.raises(ValueError):
        user_controller.get_user_by_email('user')

def test_database_exception(user_controller):
    user_controller.dao.find.side_effect = Exception('DB error')
    with pytest.raises(Exception) as excinfo:
        user_controller.get_user_by_email('user@example.com')
    assert "DB error" in str(excinfo.value)