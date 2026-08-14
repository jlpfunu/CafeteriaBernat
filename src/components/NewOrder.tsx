import { useMemo, useState } from 'react'
import type { MenuItem, Order, OrderLine, Category } from '../types'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../types'
import { newId } from '../storage'

const CATEGORY_STYLES: Record<Category, { chip: string; ring: string }> = {
  cafe: { chip: 'bg-mustard text-choco', ring: 'ring-mustard-dark' },
  infusion: { chip: 'bg-sage text-paper', ring: 'ring-sage-dark' },
  copa: { chip: 'bg-lavender text-paper', ring: 'ring-lavender' },
}

export default function NewOrder({
  menu,
  onCreateOrder,
}: {
  menu: MenuItem[]
  onCreateOrder: (order: Order) => void
}) {
  const [cart, setCart] = useState<Record<string, number>>({})
  const [customer, setCustomer] = useState('')
  const [markPaid, setMarkPaid] = useState(false)
  const [justAdded, setJustAdded] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const g: Record<Category, MenuItem[]> = { cafe: [], infusion: [], copa: [] }
    for (const item of menu) g[item.category].push(item)
    return g
  }, [menu])

  const lines: OrderLine[] = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = menu.find((m) => m.id === id)!
        return { menuItemId: id, name: item.name, price: item.price, qty }
      })
  }, [cart, menu])

  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0)

  function addItem(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
    setJustAdded(id)
    window.setTimeout(() => setJustAdded((cur) => (cur === id ? null : cur)), 250)
  }

  function changeQty(id: string, delta: number) {
    setCart((c) => {
      const next = Math.max(0, (c[id] ?? 0) + delta)
      return { ...c, [id]: next }
    })
  }

  function resetForm() {
    setCart({})
    setCustomer('')
    setMarkPaid(false)
  }

  function handleSave() {
    if (lines.length === 0) return
    const order: Order = {
      id: newId(),
      customer: customer.trim(),
      lines,
      total,
      paid: markPaid,
      createdAt: Date.now(),
      paidAt: markPaid ? Date.now() : null,
    }
    onCreateOrder(order)
    resetForm()
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-40 pt-6">
      <header className="mb-5">
        <h1 className="font-display text-3xl font-bold text-choco">Nuevo pedido</h1>
        <p className="text-sm text-choco-soft">Toca lo que se ha pedido para añadirlo a la comanda.</p>
      </header>

      {CATEGORY_ORDER.map((cat) => (
        <section key={cat} className="mb-6">
          <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-choco-soft">
            <span className={`rounded-full px-3 py-0.5 text-xs uppercase tracking-wide ${CATEGORY_STYLES[cat].chip}`}>
              {CATEGORY_LABELS[cat]}
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {grouped[cat].map((item) => (
              <button
                key={item.id}
                onClick={() => addItem(item.id)}
                className={`flex flex-col items-start gap-1 rounded-2xl border-2 border-choco bg-white/70 p-3 text-left shadow-[3px_3px_0_#2b1b14] transition active:translate-y-0.5 active:shadow-[1px_1px_0_#2b1b14] ${
                  justAdded === item.id ? 'animate-pop ring-4 ' + CATEGORY_STYLES[cat].ring : ''
                }`}
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="font-display text-base font-semibold leading-tight">{item.name}</span>
                <span className="font-display text-sm text-choco-soft">{item.price.toFixed(2)} €</span>
                {cart[item.id] > 0 && (
                  <span className="mt-1 rounded-full bg-choco px-2 py-0.5 font-display text-xs text-paper">
                    x{cart[item.id]}
                  </span>
                )}
              </button>
            ))}
            {grouped[cat].length === 0 && (
              <p className="col-span-2 text-sm italic text-choco-soft/70">Nada en esta categoría todavía.</p>
            )}
          </div>
        </section>
      ))}

      {/* Comanda flotante */}
      {lines.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-10 mx-auto max-w-md px-4">
          <div className="ticket-edge rounded-t-2xl border-2 border-choco bg-white p-4 pb-6 shadow-[4px_4px_0_#2b1b14]">
            <p className="mb-2 font-display text-sm font-bold uppercase tracking-wide text-choco-soft">Comanda</p>
            <ul className="mb-3 max-h-32 space-y-1 overflow-y-auto pr-1 font-mono text-sm">
              {lines.map((l) => (
                <li key={l.menuItemId} className="flex items-center justify-between gap-2">
                  <span className="truncate">{l.name}</span>
                  <span className="flex items-center gap-2">
                    <button
                      onClick={() => changeQty(l.menuItemId, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-choco text-xs"
                      aria-label={`Quitar uno de ${l.name}`}
                    >
                      −
                    </button>
                    <span className="w-4 text-center">{l.qty}</span>
                    <button
                      onClick={() => changeQty(l.menuItemId, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-choco text-xs"
                      aria-label={`Añadir uno de ${l.name}`}
                    >
                      +
                    </button>
                    <span className="w-14 text-right">{(l.price * l.qty).toFixed(2)}€</span>
                  </span>
                </li>
              ))}
            </ul>

            <input
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="¿Para quién es? (opcional)"
              className="mb-3 w-full rounded-lg border-2 border-choco/30 bg-paper px-3 py-2 text-sm outline-none focus:border-mustard-dark"
            />

            <div className="mb-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-choco-soft">
                <input
                  type="checkbox"
                  checked={markPaid}
                  onChange={(e) => setMarkPaid(e.target.checked)}
                  className="h-4 w-4 accent-sage-dark"
                />
                Ya está cobrado
              </label>
              <span className="font-display text-xl font-bold text-choco">{total.toFixed(2)} €</span>
            </div>

            <button
              onClick={handleSave}
              className="w-full rounded-xl bg-coral py-3 font-display text-lg font-bold text-white shadow-[3px_3px_0_#2b1b14] transition active:translate-y-0.5 active:shadow-[1px_1px_0_#2b1b14]"
            >
              Guardar pedido
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
