import type { MenuItem, Order } from './types'

const MENU_KEY = 'cafeApp:menu'
const ORDERS_KEY = 'cafeApp:orders'
const SHOPNAME_KEY = 'cafeApp:shopName'

export const DEFAULT_MENU: MenuItem[] = [
  { id: 'cafe-solo', name: 'Café solo', category: 'cafe', price: 1.2, emoji: '☕' },
  { id: 'cortado', name: 'Cortado', category: 'cafe', price: 1.3, emoji: '☕' },
  { id: 'con-leche', name: 'Café con leche', category: 'cafe', price: 1.5, emoji: '☕' },
  { id: 'capuchino', name: 'Capuchino', category: 'cafe', price: 1.8, emoji: '☕' },
  { id: 'te', name: 'Té', category: 'infusion', price: 1.2, emoji: '🍵' },
  { id: 'manzanilla', name: 'Manzanilla', category: 'infusion', price: 1.2, emoji: '🍵' },
  { id: 'poleo', name: 'Poleo menta', category: 'infusion', price: 1.2, emoji: '🍵' },
  { id: 'zumo', name: 'Zumo de naranja', category: 'copa', price: 1.5, emoji: '🥤' },
  { id: 'refresco', name: 'Refresco', category: 'copa', price: 1.5, emoji: '🥤' },
  { id: 'batido', name: 'Batido', category: 'copa', price: 2.0, emoji: '🧋' },
]

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadMenu(): MenuItem[] {
  return read<MenuItem[]>(MENU_KEY, DEFAULT_MENU)
}

export function saveMenu(menu: MenuItem[]) {
  write(MENU_KEY, menu)
}

export function loadOrders(): Order[] {
  return read<Order[]>(ORDERS_KEY, [])
}

export function saveOrders(orders: Order[]) {
  write(ORDERS_KEY, orders)
}

export function loadShopName(): string {
  return read<string>(SHOPNAME_KEY, 'Mi Cafetería')
}

export function saveShopName(name: string) {
  write(SHOPNAME_KEY, name)
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}
