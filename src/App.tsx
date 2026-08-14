import { useEffect, useState } from 'react'
import type { Tab } from './components/BottomNav'
import BottomNav from './components/BottomNav'
import NewOrder from './components/NewOrder'
import OrdersList from './components/OrdersList'
import MenuEditor from './components/MenuEditor'
import type { MenuItem, Order } from './types'
import { loadMenu, saveMenu, loadOrders, saveOrders, loadShopName, saveShopName } from './storage'

export default function App() {
  const [tab, setTab] = useState<Tab>('pedir')
  const [menu, setMenu] = useState<MenuItem[]>(() => loadMenu())
  const [orders, setOrders] = useState<Order[]>(() => loadOrders())
  const [shopName, setShopName] = useState<string>(() => loadShopName())
  const [editingName, setEditingName] = useState(false)

  useEffect(() => saveMenu(menu), [menu])
  useEffect(() => saveOrders(orders), [orders])
  useEffect(() => saveShopName(shopName), [shopName])

  const pendingCount = orders.filter((o) => !o.paid).length

  function handleCreateOrder(order: Order) {
    setOrders((prev) => [order, ...prev])
    setTab('pedidos')
  }

  function togglePaid(id: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, paid: !o.paid, paidAt: !o.paid ? Date.now() : null } : o,
      ),
    )
  }

  function deleteOrder(id: string) {
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  return (
    <div className="min-h-full">
      <header className="border-b-4 border-choco bg-mustard px-4 py-4 shadow-[0_4px_0_#c47f1f]">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <span className="text-3xl">☕</span>
          {editingName ? (
            <input
              autoFocus
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
              className="min-w-0 flex-1 border-b-2 border-choco bg-transparent font-display text-xl font-bold text-choco outline-none"
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="min-w-0 flex-1 truncate text-left font-display text-xl font-bold text-choco"
              title="Toca para cambiar el nombre"
            >
              {shopName}
            </button>
          )}
        </div>
      </header>

      <main>
        {tab === 'pedir' && <NewOrder menu={menu} onCreateOrder={handleCreateOrder} />}
        {tab === 'pedidos' && (
          <OrdersList orders={orders} onTogglePaid={togglePaid} onDelete={deleteOrder} />
        )}
        {tab === 'carta' && <MenuEditor menu={menu} onChange={setMenu} />}
      </main>

      <BottomNav active={tab} onChange={setTab} pendingCount={pendingCount} />
    </div>
  )
}
