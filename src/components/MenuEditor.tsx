import { useMemo, useState } from 'react'
import type { Category, MenuItem } from '../types'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../types'
import { newId } from '../storage'

const EMOJI_OPTIONS = ['☕', '🍵', '🥤', '🧋', '🍫', '🧃', '🍹', '🍮']

export default function MenuEditor({
  menu,
  onChange,
}: {
  menu: MenuItem[]
  onChange: (menu: MenuItem[]) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [draftPrice, setDraftPrice] = useState('')
  const [draftCategory, setDraftCategory] = useState<Category>('cafe')
  const [draftEmoji, setDraftEmoji] = useState('☕')

  const grouped = useMemo(() => {
    const g: Record<Category, MenuItem[]> = { cafe: [], infusion: [], copa: [] }
    for (const item of menu) g[item.category].push(item)
    return g
  }, [menu])

  function updateItem(id: string, patch: Partial<MenuItem>) {
    onChange(menu.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }

  function removeItem(id: string) {
    onChange(menu.filter((m) => m.id !== id))
  }

  function addItem() {
    const price = parseFloat(draftPrice.replace(',', '.'))
    if (!draftName.trim() || Number.isNaN(price) || price < 0) return
    const item: MenuItem = {
      id: newId(),
      name: draftName.trim(),
      category: draftCategory,
      price,
      emoji: draftEmoji,
    }
    onChange([...menu, item])
    setDraftName('')
    setDraftPrice('')
    setShowForm(false)
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-6">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-choco">La carta</h1>
          <p className="text-sm text-choco-soft">Añade, edita o borra lo que se puede pedir.</p>
        </div>
      </header>

      {CATEGORY_ORDER.map((cat) => (
        <section key={cat} className="mb-6">
          <h2 className="mb-2 font-display text-lg font-bold text-choco-soft">{CATEGORY_LABELS[cat]}</h2>
          <ul className="space-y-2">
            {grouped[cat].map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2 rounded-xl border-2 border-choco bg-white/70 p-2 shadow-[2px_2px_0_#2b1b14]"
              >
                <span className="text-2xl">{item.emoji}</span>
                <input
                  value={item.name}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                  className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-1 py-1 font-display font-semibold outline-none focus:border-mustard-dark"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                    className="w-16 rounded-lg border border-choco/30 bg-paper px-1 py-1 text-right font-display"
                  />
                  <span className="text-sm text-choco-soft">€</span>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label={`Borrar ${item.name}`}
                  className="ml-1 text-choco-soft"
                >
                  🗑️
                </button>
              </li>
            ))}
            {grouped[cat].length === 0 && (
              <p className="text-sm italic text-choco-soft/70">Sin artículos en esta categoría.</p>
            )}
          </ul>
        </section>
      ))}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-xl border-2 border-dashed border-choco/50 py-3 font-display font-bold text-choco-soft"
        >
          + Añadir algo nuevo a la carta
        </button>
      )}

      {showForm && (
        <div className="animate-pop rounded-2xl border-2 border-choco bg-white p-4 shadow-[3px_3px_0_#2b1b14]">
          <p className="mb-3 font-display text-lg font-bold text-choco">Nuevo artículo</p>

          <label className="mb-2 block text-sm font-semibold text-choco-soft">Nombre</label>
          <input
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder="Ej. Chocolate caliente"
            className="mb-3 w-full rounded-lg border-2 border-choco/30 bg-paper px-3 py-2 outline-none focus:border-mustard-dark"
          />

          <label className="mb-2 block text-sm font-semibold text-choco-soft">Precio</label>
          <input
            value={draftPrice}
            onChange={(e) => setDraftPrice(e.target.value)}
            placeholder="1.50"
            inputMode="decimal"
            className="mb-3 w-full rounded-lg border-2 border-choco/30 bg-paper px-3 py-2 outline-none focus:border-mustard-dark"
          />

          <label className="mb-2 block text-sm font-semibold text-choco-soft">Categoría</label>
          <div className="mb-3 flex gap-2">
            {CATEGORY_ORDER.map((cat) => (
              <button
                key={cat}
                onClick={() => setDraftCategory(cat)}
                className={`flex-1 rounded-lg border-2 border-choco py-2 font-display text-sm font-semibold ${
                  draftCategory === cat ? 'bg-mustard' : 'bg-white'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          <label className="mb-2 block text-sm font-semibold text-choco-soft">Icono</label>
          <div className="mb-4 flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                onClick={() => setDraftEmoji(e)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 border-choco text-xl ${
                  draftEmoji === e ? 'bg-mustard' : 'bg-white'
                }`}
              >
                {e}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 rounded-xl border-2 border-choco py-2 font-display font-bold text-choco"
            >
              Cancelar
            </button>
            <button
              onClick={addItem}
              className="flex-1 rounded-xl bg-sage-dark py-2 font-display font-bold text-white shadow-[2px_2px_0_#2b1b14]"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
