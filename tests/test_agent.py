from datetime import datetime

import pytest

from app.storage import storage
from app.agent import handle_agent_command


def setup_function() -> None:
    storage.inventory.clear()
    storage.employee_logs.clear()
    storage.reminders.clear()
    storage.restock("SKU123", 50, name="Producto X")


def test_sale_command_reduces_inventory():
    result = handle_agent_command("Vendí 10 unidades de SKU123")
    assert result["action"] == "sale"
    assert storage.inventory["SKU123"].quantity == 40


def test_reminder_command_creates_entry():
    result = handle_agent_command("Recordar a Ana que lleve su pedido mañana")
    assert result["action"] == "reminder"
    assert storage.reminders


def test_unknown_command_raises_error():
    with pytest.raises(ValueError):
        handle_agent_command("esto no tiene sentido")
