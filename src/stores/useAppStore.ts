import { create } from 'zustand';
import type { OrderItem, Product } from '@/types';

interface AppState {
  // UI
  activeSection: string;
  isMenuOpen: boolean;
  isLoading: boolean;

  // Order
  orderItems: OrderItem[];

  // UI actions
  setActiveSection: (section: string) => void;
  setMenuOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;

  // Order actions
  addToOrder: (product: Product, quantity?: number) => void;
  removeFromOrder: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearOrder: () => void;
  getOrderTotal: () => number;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  activeSection: 'hero',
  isMenuOpen: false,
  isLoading: true,
  orderItems: [],

  // UI actions
  setActiveSection: (section) => set({ activeSection: section }),
  setMenuOpen: (open) => set({ isMenuOpen: open }),
  setLoading: (loading) => set({ isLoading: loading }),

  // Order actions
  addToOrder: (product, quantity = 1) => {
    const items = get().orderItems;
    const existing = items.find((item) => item.product_id === product.id);

    if (existing) {
      set({
        orderItems: items.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
    } else {
      set({
        orderItems: [
          ...items,
          {
            product_id: product.id,
            product_name: product.name,
            quantity,
            unit: product.unit,
            unit_price: product.price,
          },
        ],
      });
    }
  },

  removeFromOrder: (productId) => {
    set({
      orderItems: get().orderItems.filter((item) => item.product_id !== productId),
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromOrder(productId);
      return;
    }
    set({
      orderItems: get().orderItems.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      ),
    });
  },

  clearOrder: () => set({ orderItems: [] }),

  getOrderTotal: () => {
    return get().orderItems.reduce(
      (total, item) => total + item.unit_price * item.quantity,
      0
    );
  },
}));
