import { useState } from 'react';
import clsx from 'clsx';

const defaultReminder = {
  description: '',
  due_at: '',
  customer: ''
};

export function ReminderPanel({ className, query, onCreate }) {
  const [form, setForm] = useState(defaultReminder);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.description || !form.due_at) return;
    onCreate({
      description: form.description,
      customer: form.customer || undefined,
      due_at: new Date(form.due_at).toISOString()
    });
    setForm(defaultReminder);
  };

  return (
    <section className={clsx('flex h-full flex-col gap-4 p-6 text-neutral-800', className)}>
      <header className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Recordatorios</h3>
          <p className="text-xs text-neutral-500">Anuncios pendientes controlados por el bot.</p>
        </div>
        {query.isLoading && <span className="text-xs text-neutral-400">Cargando…</span>}
      </header>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto rounded-xl border border-black/10 bg-neutral-50 p-4">
        {(query.data ?? []).map((reminder, index) => (
          <article key={`${reminder.description}-${index}`} className="rounded-lg border border-black/10 bg-white p-3">
            <h4 className="text-sm font-semibold text-neutral-900">{reminder.description}</h4>
            <p className="text-xs text-neutral-500">
              {new Date(reminder.due_at).toLocaleString('es-AR', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </p>
            {reminder.customer && (
              <p className="text-xs text-neutral-500">Cliente: {reminder.customer}</p>
            )}
          </article>
        ))}
        {query.data?.length === 0 && !query.isLoading && (
          <p className="text-center text-sm text-neutral-400">Sin recordatorios activos.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 rounded-xl border border-black/10 bg-neutral-50 p-4 text-xs uppercase tracking-[0.35em] text-neutral-500">
        <span className="text-[11px] text-neutral-500">Agregar manualmente</span>
        <div className="space-y-2 text-[13px] normal-case text-neutral-800">
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-neutral-500">
            Descripción
            <input
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black/15"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-neutral-500">
            Cliente
            <input
              value={form.customer}
              onChange={(event) => setForm((prev) => ({ ...prev, customer: event.target.value }))}
              className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black/15"
              placeholder="Opcional"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-neutral-500">
            Fecha límite
            <input
              type="datetime-local"
              value={form.due_at}
              onChange={(event) => setForm((prev) => ({ ...prev, due_at: event.target.value }))}
              className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black/15"
            />
          </label>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-900"
        >
          Crear recordatorio
        </button>
      </form>
    </section>
  );
}
