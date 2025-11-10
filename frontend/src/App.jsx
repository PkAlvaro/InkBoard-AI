import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getEmployeeLogs,
  getInventory,
  getReminders,
  postAgentCommand,
  postRestock,
  postSale,
  createReminder
} from './api';
import { CommandPanel } from './components/CommandPanel.jsx';
import { InventoryPanel } from './components/InventoryPanel.jsx';
import { EmployeeLogPanel } from './components/EmployeeLogPanel.jsx';
import { ReminderPanel } from './components/ReminderPanel.jsx';

const panelClassName =
  'rounded-2xl border border-black/10 bg-white shadow-[0_25px_85px_-60px_rgba(0,0,0,0.65)] backdrop-blur-sm';

export default function App() {
  const queryClient = useQueryClient();

  const inventoryQuery = useQuery({ queryKey: ['inventory'], queryFn: getInventory });
  const employeeQuery = useQuery({ queryKey: ['employees'], queryFn: getEmployeeLogs });
  const reminderQuery = useQuery({ queryKey: ['reminders'], queryFn: getReminders });

  const invalidateAll = useMemo(
    () => () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
    [queryClient]
  );

  const agentMutation = useMutation({
    mutationFn: postAgentCommand,
    onSuccess: invalidateAll
  });

  const restockMutation = useMutation({
    mutationFn: postRestock,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory'] })
  });

  const saleMutation = useMutation({
    mutationFn: postSale,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory'] })
  });

  const reminderMutation = useMutation({
    mutationFn: createReminder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reminders'] })
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">InkBoard AI</p>
          <h1 className="text-3xl font-semibold text-neutral-900 sm:text-4xl">Panel demo asistido por IA</h1>
          <p className="max-w-2xl text-sm text-neutral-600">
            Interactúa con el asistente en español para actualizar inventario, registrar turnos y generar
            recordatorios. Todo se almacena en una capa en memoria que expone la API de FastAPI construida en el
            repositorio.
          </p>
        </header>

        <CommandPanel
          isLoading={agentMutation.isLoading}
          result={agentMutation.data}
          error={agentMutation.error?.message}
          onSubmit={agentMutation.mutate}
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <InventoryPanel
            className={panelClassName}
            query={inventoryQuery}
            onRestock={(payload) => restockMutation.mutate(payload)}
            onSale={(payload) => saleMutation.mutate(payload)}
          />
          <EmployeeLogPanel className={panelClassName} query={employeeQuery} />
          <ReminderPanel
            className={panelClassName}
            query={reminderQuery}
            onCreate={(payload) => reminderMutation.mutate(payload)}
          />
        </div>
      </div>
    </div>
  );
}
