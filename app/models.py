from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict


@dataclass
class InventoryItem:
    sku: str
    name: str
    quantity: int = 0

    def sell(self, amount: int) -> None:
        if amount < 0:
            raise ValueError("Sale amount must be positive")
        if amount > self.quantity:
            raise ValueError("Not enough inventory to complete sale")
        self.quantity -= amount

    def restock(self, amount: int) -> None:
        if amount < 0:
            raise ValueError("Restock amount must be positive")
        self.quantity += amount


@dataclass
class EmployeeLog:
    employee_id: str
    event: str
    timestamp: datetime = field(default_factory=datetime.utcnow)


@dataclass
class Reminder:
    description: str
    due_at: datetime
    customer: str | None = None
    metadata: Dict[str, str] = field(default_factory=dict)
