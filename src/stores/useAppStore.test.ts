import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './useAppStore';
import type { Product } from '@/types';

const mockProduct: Product = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Huevos de Campo Libre',
  slug: 'huevos-campo-libre',
  description: 'Gallinas criadas en libertad',
  long_desc: null,
  price: 4500,
  unit: 'docena',
  category: 'campo_libre',
  image_url: null,
  image_alt: null,
  is_featured: true,
  is_available: true,
  sort_order: 1,
  nutrition: null,
  origin: 'Entre Ríos',
  created_at: '2026-03-18T00:00:00Z',
  updated_at: '2026-03-18T00:00:00Z',
};

const mockProduct2: Product = {
  ...mockProduct,
  id: '660e8400-e29b-41d4-a716-446655440001',
  name: 'Huevos Orgánicos',
  slug: 'huevos-organicos',
  price: 6200,
  category: 'organico',
};

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store between tests
    useAppStore.setState({
      activeSection: 'hero',
      isMenuOpen: false,
      isLoading: true,
      orderItems: [],
    });
  });

  describe('UI actions', () => {
    it('sets active section', () => {
      useAppStore.getState().setActiveSection('products');
      expect(useAppStore.getState().activeSection).toBe('products');
    });

    it('toggles menu open state', () => {
      useAppStore.getState().setMenuOpen(true);
      expect(useAppStore.getState().isMenuOpen).toBe(true);

      useAppStore.getState().setMenuOpen(false);
      expect(useAppStore.getState().isMenuOpen).toBe(false);
    });

    it('sets loading state', () => {
      useAppStore.getState().setLoading(false);
      expect(useAppStore.getState().isLoading).toBe(false);
    });
  });

  describe('addToOrder', () => {
    it('adds a product to the order', () => {
      useAppStore.getState().addToOrder(mockProduct);
      const items = useAppStore.getState().orderItems;

      expect(items).toHaveLength(1);
      expect(items[0].product_id).toBe(mockProduct.id);
      expect(items[0].product_name).toBe(mockProduct.name);
      expect(items[0].quantity).toBe(1);
      expect(items[0].unit).toBe(mockProduct.unit);
      expect(items[0].unit_price).toBe(mockProduct.price);
    });

    it('adds a product with custom quantity', () => {
      useAppStore.getState().addToOrder(mockProduct, 3);
      expect(useAppStore.getState().orderItems[0].quantity).toBe(3);
    });

    it('increments quantity when adding an existing product', () => {
      useAppStore.getState().addToOrder(mockProduct, 2);
      useAppStore.getState().addToOrder(mockProduct, 3);

      const items = useAppStore.getState().orderItems;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(5);
    });

    it('adds multiple different products', () => {
      useAppStore.getState().addToOrder(mockProduct);
      useAppStore.getState().addToOrder(mockProduct2);

      expect(useAppStore.getState().orderItems).toHaveLength(2);
    });
  });

  describe('removeFromOrder', () => {
    it('removes a product from the order', () => {
      useAppStore.getState().addToOrder(mockProduct);
      useAppStore.getState().addToOrder(mockProduct2);
      useAppStore.getState().removeFromOrder(mockProduct.id);

      const items = useAppStore.getState().orderItems;
      expect(items).toHaveLength(1);
      expect(items[0].product_id).toBe(mockProduct2.id);
    });

    it('does nothing when removing a non-existent product', () => {
      useAppStore.getState().addToOrder(mockProduct);
      useAppStore.getState().removeFromOrder('non-existent-id');

      expect(useAppStore.getState().orderItems).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('updates the quantity of an existing item', () => {
      useAppStore.getState().addToOrder(mockProduct);
      useAppStore.getState().updateQuantity(mockProduct.id, 5);

      expect(useAppStore.getState().orderItems[0].quantity).toBe(5);
    });

    it('removes the item when quantity is set to 0', () => {
      useAppStore.getState().addToOrder(mockProduct);
      useAppStore.getState().updateQuantity(mockProduct.id, 0);

      expect(useAppStore.getState().orderItems).toHaveLength(0);
    });
  });

  describe('clearOrder', () => {
    it('removes all items from the order', () => {
      useAppStore.getState().addToOrder(mockProduct);
      useAppStore.getState().addToOrder(mockProduct2);
      useAppStore.getState().clearOrder();

      expect(useAppStore.getState().orderItems).toHaveLength(0);
    });
  });

  describe('getOrderTotal', () => {
    it('returns 0 for empty order', () => {
      expect(useAppStore.getState().getOrderTotal()).toBe(0);
    });

    it('calculates total correctly for one item', () => {
      useAppStore.getState().addToOrder(mockProduct, 2);
      expect(useAppStore.getState().getOrderTotal()).toBe(9000); // 4500 * 2
    });

    it('calculates total correctly for multiple items', () => {
      useAppStore.getState().addToOrder(mockProduct, 1);  // 4500
      useAppStore.getState().addToOrder(mockProduct2, 2); // 6200 * 2 = 12400
      expect(useAppStore.getState().getOrderTotal()).toBe(16900);
    });
  });
});
