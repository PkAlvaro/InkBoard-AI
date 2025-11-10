import clsx from 'clsx';
import { UserIcon } from '@heroicons/react/24/outline';

export function EmployeeLogPanel({ className, query }) {
  return (
    <section className={clsx('flex h-full flex-col gap-4 p-6 text-neutral-800', className)}>
      <header className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Actividad de personal</h3>
          <p className="text-xs text-neutral-500">Entradas y salidas registradas recientemente.</p>
        </div>
        {query.isLoading && <span className="text-xs text-neutral-400">Cargando…</span>}
      </header>

      <ul className="flex flex-1 flex-col gap-3 overflow-y-auto rounded-xl border border-black/10 bg-neutral-50 p-4">
        {(query.data ?? []).map((log, index) => (
          <li key={`${log.employee_id}-${log.timestamp}-${index}`} className="flex items-start gap-3">
            <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
              <UserIcon className="h-4 w-4" />
            </span>
            <div className="text-sm text-neutral-800">
              <p className="font-semibold">
                {log.employee_id}
                <span className="ml-2 text-xs font-normal text-neutral-500">{log.event}</span>
              </p>
              <p className="text-xs text-neutral-500">
                {new Date(log.timestamp).toLocaleString('es-AR', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </p>
            </div>
          </li>
        ))}
        {query.data?.length === 0 && !query.isLoading && (
          <li className="text-center text-sm text-neutral-400">Sin registros aún. Prueba con el asistente.</li>
        )}
      </ul>
    </section>
  );
}
