from __future__ import annotations

from datetime import datetime
from typing import Dict

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from app.agent import handle_agent_command
from app.storage import storage

app = FastAPI(title="InkBoard AI Demo", description="Demo ERP asistido por IA para pequeños negocios")


class InventoryUpdate(BaseModel):
    sku: str = Field(..., description="Identificador del producto")
    name: str | None = Field(None, description="Nombre legible del producto")
    amount: int = Field(..., gt=0, description="Cantidad a agregar o vender")


class EmployeeEvent(BaseModel):
    employee_id: str
    event: str
    timestamp: datetime | None = None


class ReminderPayload(BaseModel):
    description: str
    due_at: datetime
    customer: str | None = None
    metadata: Dict[str, str] | None = None


class AgentCommand(BaseModel):
    command: str


@app.post("/inventory/restock")
def restock_item(payload: InventoryUpdate):
    item = storage.restock(payload.sku.upper(), payload.amount, name=payload.name)
    return {"sku": item.sku, "name": item.name, "quantity": item.quantity}


@app.post("/inventory/sale")
def record_sale(payload: InventoryUpdate):
    try:
        item = storage.record_sale(payload.sku.upper(), payload.amount)
    except ValueError as exc:  # pragma: no cover - FastAPI handles response
        raise HTTPException(status_code=400, detail=str(exc))
    return {"sku": item.sku, "name": item.name, "quantity": item.quantity}


@app.get("/inventory")
def get_inventory():
    return [
        {"sku": item.sku, "name": item.name, "quantity": item.quantity}
        for item in storage.get_inventory_snapshot().values()
    ]


@app.post("/employees/log")
def log_employee(payload: EmployeeEvent):
    log = storage.add_employee_log(
        employee_id=payload.employee_id,
        event=payload.event,
        timestamp=payload.timestamp,
    )
    return {"employee_id": log.employee_id, "event": log.event, "timestamp": log.timestamp}


@app.get("/employees/logs")
def list_employee_logs():
    return [
        {"employee_id": log.employee_id, "event": log.event, "timestamp": log.timestamp}
        for log in storage.get_employee_logs()
    ]


@app.post("/reminders")
def create_reminder(payload: ReminderPayload):
    reminder = storage.add_reminder(
        description=payload.description,
        due_at=payload.due_at,
        customer=payload.customer,
        metadata=payload.metadata,
    )
    return {
        "description": reminder.description,
        "due_at": reminder.due_at,
        "customer": reminder.customer,
        "metadata": reminder.metadata,
    }


@app.get("/reminders")
def list_reminders():
    return [
        {
            "description": reminder.description,
            "due_at": reminder.due_at,
            "customer": reminder.customer,
            "metadata": reminder.metadata,
        }
        for reminder in storage.get_reminders()
    ]


@app.post("/agent")
def run_agent(payload: AgentCommand):
    try:
        return handle_agent_command(payload.command)
    except ValueError as exc:  # pragma: no cover - FastAPI handles response
        raise HTTPException(status_code=400, detail=str(exc))
