const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

async function handleResponse(response) {
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    const message = detail?.detail || response.statusText;
    throw new Error(message);
  }
  return response.json();
}

export async function getInventory() {
  const res = await fetch(`${API_URL}/inventory`);
  return handleResponse(res);
}

export async function postRestock(payload) {
  const res = await fetch(`${API_URL}/inventory/restock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function postSale(payload) {
  const res = await fetch(`${API_URL}/inventory/sale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function getEmployeeLogs() {
  const res = await fetch(`${API_URL}/employees/logs`);
  return handleResponse(res);
}

export async function getReminders() {
  const res = await fetch(`${API_URL}/reminders`);
  return handleResponse(res);
}

export async function postAgentCommand(command) {
  const res = await fetch(`${API_URL}/agent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command })
  });
  return handleResponse(res);
}

export async function createReminder(payload) {
  const res = await fetch(`${API_URL}/reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}
