export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In stock' | 'Low stock' | 'Out of stock';
  // Index signature so it satisfies cw-table's `Record<string, unknown>` bound.
  [key: string]: unknown;
}

export interface Order {
  id: string;
  customer: string;
  date: Date;
  total: number;
  status: 'Paid' | 'Pending' | 'Refunded';
  [key: string]: unknown;
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

export interface Customer {
  id: number;
  name: string;
  handle: string;
  initials: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  orders: number;
  spent: number;
  rating: number;
  active: boolean;
}

export function seedCustomers(): Customer[] {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Linus Torvalds', 'Margaret Hamilton',
    'Katherine Johnson', 'Alan Turing', 'Radia Perlman', 'Barbara Liskov',
    'Donald Knuth', 'Edsger Dijkstra', 'Tim Berners-Lee', 'Hedy Lamarr'];
  const plans: Customer['plan'][] = ['Free', 'Pro', 'Enterprise'];
  return names.map((name, i) => {
    const [f, l] = name.split(' ');
    return {
      id: i + 1,
      name,
      handle: '@' + (f[0] + l).toLowerCase(),
      initials: (f[0] + l[0]).toUpperCase(),
      plan: plans[i % plans.length],
      orders: 3 + ((i * 13) % 48),
      spent: Math.round((120 + ((i * 317) % 9800)) * 100) / 100,
      rating: 3 + (i % 3),
      active: i % 4 !== 0
    };
  });
}

export function planSeverity(plan: Customer['plan']): 'neutral' | 'info' | 'success' {
  return plan === 'Enterprise' ? 'success' : plan === 'Pro' ? 'info' : 'neutral';
}

export const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France',
  'Japan', 'Australia', 'Brazil', 'India', 'Netherlands', 'Sweden', 'Spain'];

export const SKILLS = ['Angular', 'TypeScript', 'RxJS', 'CSS', 'Node.js', 'GraphQL',
  'Design systems', 'Accessibility', 'Testing', 'Figma'];
