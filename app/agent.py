from __future__ import annotations

import re
from datetime import datetime, timedelta

from .storage import storage

COMMAND_PATTERNS = {
    "sale": re.compile(
        r"vend[ií]\s+(?P<amount>\d+)\s+unidades?\s+de\s+(?P<sku>\w+)",
        re.IGNORECASE,
    ),
    "restock": re.compile(
        r"(agregu[eé]|sum[aé])\s+(?P<amount>\d+)\s+unidades?\s+de\s+(?P<sku>\w+)(?:\s+como\s+(?P<name>[\w\s]+))?",
        re.IGNORECASE,
    ),
    "reminder": re.compile(
        r"recordar\s+a\s+(?P<customer>[\w\s]+)\s+que\s+(?P<description>.+)\s+mañana",
        re.IGNORECASE,
    ),
    "shift": re.compile(
        r"(registr[aá]|marca)\s+(?P<event>entrada|salida)\s+de\s+(?P<employee>\w+)",
        re.IGNORECASE,
    ),
}


def handle_agent_command(command: str) -> dict:
    """Best-effort natural language command handler for the demo."""

    command = command.strip()
    if not command:
        raise ValueError("Command cannot be empty")

    if match := COMMAND_PATTERNS["sale"].search(command):
        amount = int(match.group("amount"))
        sku = match.group("sku").upper()
        item = storage.record_sale(sku=sku, amount=amount)
        return {
            "action": "sale",
            "sku": sku,
            "quantity": item.quantity,
            "message": f"Venta registrada. Quedan {item.quantity} unidades de {item.name}",
        }

    if match := COMMAND_PATTERNS["restock"].search(command):
        amount = int(match.group("amount"))
        sku = match.group("sku").upper()
        name = match.group("name")
        item = storage.restock(sku=sku, amount=amount, name=name.strip() if name else None)
        return {
            "action": "restock",
            "sku": sku,
            "quantity": item.quantity,
            "message": f"Inventario actualizado. Hay {item.quantity} unidades de {item.name}",
        }

    if match := COMMAND_PATTERNS["reminder"].search(command):
        customer = match.group("customer").strip()
        description = match.group("description").strip()
        reminder = storage.add_reminder(
            description=description,
            due_at=datetime.utcnow() + timedelta(days=1),
            customer=customer,
        )
        return {
            "action": "reminder",
            "customer": reminder.customer,
            "description": reminder.description,
            "due_at": reminder.due_at.isoformat(),
        }

    if match := COMMAND_PATTERNS["shift"].search(command):
        employee = match.group("employee").lower()
        event = match.group("event").lower()
        log = storage.add_employee_log(
            employee_id=employee,
            event=event,
        )
        return {
            "action": "shift",
            "employee_id": log.employee_id,
            "event": log.event,
            "timestamp": log.timestamp.isoformat(),
        }

    raise ValueError("No pude entender el comando. Prueba con una frase más específica.")
