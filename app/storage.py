from __future__ import annotations

from collections import defaultdict
from datetime import datetime
from typing import Dict, List

from .models import EmployeeLog, InventoryItem, Reminder


class DemoStorage:
    """In-memory storage intended for prototype usage only."""

    def __init__(self) -> None:
        self.inventory: Dict[str, InventoryItem] = {}
        self.employee_logs: List[EmployeeLog] = []
        self.reminders: List[Reminder] = []

    # Inventory operations
    def get_inventory_snapshot(self) -> Dict[str, InventoryItem]:
        return self.inventory

    def ensure_item(self, sku: str, name: str | None = None) -> InventoryItem:
        if sku not in self.inventory:
            if not name:
                raise ValueError("Unknown SKU. Provide a name to initialize it.")
            self.inventory[sku] = InventoryItem(sku=sku, name=name)
        item = self.inventory[sku]
        if name and item.name != name:
            item.name = name
        return item

    def record_sale(self, sku: str, amount: int) -> InventoryItem:
        item = self.inventory.get(sku)
        if not item:
            raise ValueError(f"SKU {sku} not found")
        item.sell(amount)
        return item

    def restock(self, sku: str, amount: int, name: str | None = None) -> InventoryItem:
        item = self.ensure_item(sku, name)
        item.restock(amount)
        return item

    # Employee operations
    def add_employee_log(self, employee_id: str, event: str, timestamp: datetime | None = None) -> EmployeeLog:
        log = EmployeeLog(
            employee_id=employee_id,
            event=event,
            timestamp=timestamp or datetime.utcnow(),
        )
        self.employee_logs.append(log)
        return log

    def get_employee_logs(self) -> List[EmployeeLog]:
        return list(self.employee_logs)

    # Reminder operations
    def add_reminder(
        self,
        description: str,
        due_at: datetime,
        customer: str | None = None,
        metadata: Dict[str, str] | None = None,
    ) -> Reminder:
        reminder = Reminder(
            description=description,
            due_at=due_at,
            customer=customer,
            metadata=metadata or {},
        )
        self.reminders.append(reminder)
        return reminder

    def get_reminders(self) -> List[Reminder]:
        return list(self.reminders)


storage = DemoStorage()
