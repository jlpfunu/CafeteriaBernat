import { useMemo, useState } from 'react'
import type { Order } from '../types'

type Filter = 'todos' | 'pendientes' | 'cobrados'

function formatTime(ts: number) {
  const d = new Date(ts)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) + ' · ' +
    d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

export default function OrdersList({
  orders,
  onTogglePaid,
  onDelete,
}: {
  orders: Order[]
  onTogglePaid: (id: string) => void
  onDelete: (id: string) => void
}) {
  const [filter, setFilter] = useState<Filter>('todos')

  const sorted = useMemo(() => [...orders].sort((a, b) => b.createdAt - a.createdAt), [orders])

  const filtered = sorted.filter((o) => {
    if (filter === 'pendientes') return !o.paid
    if (filter === 'cobrados') return o.paid
    return true
  })

  const pendingTotal = orders.filter((o) => !o.paid).reduce((s, o) => s + o.total, 0)

  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-6">
      <header className="mb-4">
        <h1 className="font-display text-3xl font-bold text-choco">Pedidos</h1>
        <p className="text-sm text-choco-soft">
          Pendiente de cobrar: <span className="font-display font-bold text-coral-dark">{pendingTotal.toFixed(2)} €</span>
        </p>
      </header>

      <div className="mb-5 flex gap-2">
        {(
          [
            ['todos', 'Todos'],
            ['pendientes', 'Pendientes'],
            ['cobrados', 'Cobrados'],
          ] as [Filter, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`rounded-full border-2 border-choco px-3 py-1 font-display text-sm font-semibold transition ${
              filter === id ? 'bg-choco text-paper' : 'bg-white/60 text-choco'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-choco/40 p-8 text-center text-choco-soft">
          <p className="mb-1 text-4xl">🧾</p>
          <p className="font-display font-semibold">Aquí no hay nada todavía</p>
          <p className="text-sm">Los pedidos que guardes aparecerán en esta lista.</p>
        </div>
      )}

      <ul className="space-y-5">
        {filtered.map((order) => (
          <li key={order.id} className="animate-pop">
            <div className="ticket-edge relative rounded-t-2xl border-2 border-choco bg-white p-4 pb-6 shadow-[4px_4px_0_#2b1b14]">
              <div
                className={`stamp absolute right-4 top-4 px-2 py-0.5 text-xs font-bold ${
                  order.paid ? 'text-sage-dark' : 'text-coral-dark'
                }`}
              >
                {order.paid ? 'PAGADO' : 'PENDIENTE'}
              </div>

              <p className="font-display text-sm text-choco-soft">{formatTime(order.createdAt)}</p>
              {order.customer && (
                <p className="font-display text-lg font-bold text-choco">{order.customer}</p>
              )}

              <ul className="mt-2 space-y-0.5 font-mono text-sm text-choco-soft">
                {order.lines.map((l) => (
                  <li key={l.menuItemId} className="flex justify-between">
                    <span>{l.qty}× {l.name}</span>
                    <span>{(l.price * l.qty).toFixed(2)}€</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between border-t-2 border-dashed border-choco/30 pt-2">
                <span className="font-display font-bold text-choco">Total</span>
                <span className="font-display text-xl font-bold text-choco">{order.total.toFixed(2)} €</span>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => onTogglePaid(order.id)}
                  className={`flex-1 rounded-lg py-2 font-display text-sm font-bold text-white shadow-[2px_2px_0_#2b1b14] transition active:translate-y-0.5 active:shadow-none ${
                    order.paid ? 'bg-choco-soft' : 'bg-sage-dark'
                  }`}
                >
                  {order.paid ? 'Marcar pendiente' : 'Marcar cobrado'}
                </button>
                <button
                  onClick={() => onDelete(order.id)}
                  aria-label="Eliminar pedido"
                  className="rounded-lg border-2 border-choco/30 px-3 text-choco-soft"
                >
                  🗑️
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
