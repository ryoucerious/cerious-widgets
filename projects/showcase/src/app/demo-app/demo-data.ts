export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In stock' | 'Low stock' | 'Out of stock';
}

export interface Order {
  id: string;
  customer: string;
  date: Date;
  total: number;
  status: 'Paid' | 'Pending' | 'Refunded';
}

export const CATEGORIES = ['Electronics', 'Apparel', 'Home', 'Toys', 'Books'];
export const PRODUCT_STATUSES: Product['status'][] = ['In stock', 'Low stock', 'Out of stock'];

const NAMES = ['Aurora Headphones', 'Nimbus Keyboard', 'Vertex Mouse', 'Cobalt Monitor', 'Lumen Lamp',
  'Terra Mug', 'Pulse Watch', 'Echo Speaker', 'Drift Chair', 'Halo Ring', 'Onyx Wallet', 'Zephyr Fan'];

export function seedProducts(): Product[] {
  return NAMES.map((name, i) => ({
    id: i + 1,
    name,
    category: CATEGORIES[i % CATEGORIES.length],
    price: Math.round((19 + ((i * 47) % 480)) * 100) / 100,
    stock: (i * 37) % 220,
    status: PRODUCT_STATUSES[i % 3]
  }));
}

const CUSTOMERS = ['Ada Lovelace', 'Grace Hopper', 'Linus Torvalds', 'Margaret Hamilton',
  'Katherine Johnson', 'Alan Turing', 'Radia Perlman', 'Barbara Liskov'];

export function seedOrders(): Order[] {
  const statuses: Order['status'][] = ['Paid', 'Pending', 'Refunded'];
  return Array.from({ length: 8 }, (_, i) => ({
    id: `#${10245 - i}`,
    customer: CUSTOMERS[i % CUSTOMERS.length],
    date: new Date(2024, 5, 28 - i),
    total: Math.round((45 + ((i * 63) % 900)) * 100) / 100,
    status: statuses[i % 3]
  }));
}

export function orderSeverity(status: Order['status']): 'success' | 'warn' | 'danger' | 'neutral' {
  return status === 'Paid' ? 'success' : status === 'Pending' ? 'warn' : 'danger';
}

export function productSeverity(status: Product['status']): 'success' | 'warn' | 'danger' | 'neutral' {
  return status === 'In stock' ? 'success' : status === 'Low stock' ? 'warn' : 'danger';
}
