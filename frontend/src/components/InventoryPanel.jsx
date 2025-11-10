import { useState } from 'react';
import clsx from 'clsx';

const initialForm = { sku: '', name: '', amount: 1 };

export function InventoryPanel({ className, query, onRestock, onSale }) {
  const [form, setForm] = useState(initialForm);

  const submit = (handler) => (event) => {
    event.preventDefault();
    if (!form.sku || form.amount <= 0) return;
    handler({ sku: form.sku, name: form.name || undefined, amount: Number(form.amount) });
    setForm(initialForm);
  };

  return (
    <section className={clsx('flex h-full flex-col gap-4 p-6 text-neutral-800', className)}>
      <header className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Inventario</h3>
          <p className="text-xs text-neutral-500">Actualizado automáticamente por el agente.</p>
        </div>
        {query.isLoading && <span className="text-xs text-neutral-400">Cargando…</span>}
      </header>

      <div className="rounded-xl border border-black/10 bg-neutral-50">
        <table className="min-w-full divide-y divide-black/5 text-sm">
          <thead className="bg-neutral-100 text-left text-xs uppercase tracking-[0.35em] text-neutral-500">
            <tr>
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2 text-right">Cantidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {(query.data ?? []).map((item) => (
              <tr key={item.sku}>
                <td className="px-4 py-2 font-mono text-xs text-neutral-500">{item.sku}</td>
                <td className="px-4 py-2 text-neutral-900">{item.name ?? '—'}</td>
                <td className="px-4 py-2 text-right font-semibold text-neutral-900">{item.quantity}</td>
              </tr>
            ))}
            {query.data?.length === 0 && !query.isLoading && (
              <tr>
                <td className="px-4 py-3 text-center text-neutral-400" colSpan={3}>
                  Sin productos cargados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form className="grid gap-2 rounded-xl border border-black/10 bg-neutral-50 p-4 text-xs uppercase tracking-[0.35em] text-neutral-500">
        <span className="text-[11px] text-neutral-500">Acción rápida</span>
        <div className="grid gap-2 text-[13px] normal-case text-neutral-800">
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-neutral-500">
            SKU
            <input
              value={form.sku}
              onChange={(event) => setForm((prev) => ({ ...prev, sku: event.target.value.toUpperCase() }))}
              placeholder="SKU"
              className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black/15"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-neutral-500">
            Nombre
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Nombre opcional"
              className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black/15"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.3em] text-neutral-500">
            Cantidad
            <input
              type="number"
              min="1"
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: Number(event.target.value) }))}
              className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black/15"
            />
          </label>
        </div>
        <div className="mt-2 flex flex-col gap-2 text-sm">
          <button
            onClick={submit(onRestock)}
            className="rounded-lg bg-black px-3 py-2 font-semibold text-white transition-colors hover:bg-neutral-900"
          >
            Reponer
          </button>
          <button
            onClick={submit(onSale)}
            className="rounded-lg border border-black/60 px-3 py-2 font-semibold text-neutral-900 transition-colors hover:bg-neutral-200"
          >
            Registrar venta
          </button>
        </div>
      </form>
    </section>
  );
}
