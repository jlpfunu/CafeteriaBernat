type Tab = 'pedir' | 'pedidos' | 'carta'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'pedir', label: 'Pedir', icon: '📝' },
  { id: 'pedidos', label: 'Pedidos', icon: '🧾' },
  { id: 'carta', label: 'Carta', icon: '📋' },
]

export default function BottomNav({
  active,
  onChange,
  pendingCount,
}: {
  active: Tab
  onChange: (t: Tab) => void
  pendingCount: number
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t-4 border-choco bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-md">
        {TABS.map((t) => {
          const isActive = t.id === active
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`relative flex flex-1 flex-col items-center gap-1 py-3 font-display text-sm transition-transform ${
                isActive ? 'text-coral-dark scale-105' : 'text-choco-soft'
              }`}
            >
              <span className="text-2xl">{t.icon}</span>
              {t.label}
              {t.id === 'pedidos' && pendingCount > 0 && (
                <span className="absolute right-6 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-xs font-bold text-paper">
                  {pendingCount}
                </span>
              )}
              {isActive && (
                <span className="absolute -top-1 h-1.5 w-8 rounded-full bg-coral" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export type { Tab }
