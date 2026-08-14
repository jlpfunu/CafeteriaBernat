export type Category = 'cafe' | 'infusion' | 'copa'

export interface MenuItem {
  id: string
  name: string
  category: Category
  price: number
  emoji: string
}

export interface OrderLine {
  menuItemId: string
  name: string
  price: number
  qty: number
}

export interface Order {
  id: string
  customer: string
  lines: OrderLine[]
  total: number
  paid: boolean
  createdAt: number
  paidAt: number | null
}

export const CATEGORY_LABELS: Record<Category, string> = {
  cafe: 'Cafés',
  infusion: 'Infusiones',
  copa: 'Copas',
}

export const CATEGORY_ORDER: Category[] = ['cafe', 'infusion', 'copa']
