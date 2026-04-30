import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  tipo: 'producto';
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface CartStore {
  _hasHydrated: boolean;
  items: CartItem[];
  toasts: Toast[];
  setHasHydrated: (state: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, cantidad: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => () => void;
  removeToast: (id: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      items: [],
      toasts: [],
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
      addItem: (item) => {
        if (!get()._hasHydrated) return;
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, cantidad: i.cantidad + item.cantidad } : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
        get().addToast(`${item.nombre} añadido al carrito`, 'success');
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      updateQuantity: (id, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(id);
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, cantidad } : i
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.precio * item.cantidad,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce(
          (count, item) => count + item.cantidad,
          0
        );
      },
      addToast: (message, type = 'success') => {
        const toast = { id: Date.now().toString(), message, type };
        set({ toasts: [...get().toasts, toast] });
        const removeToast = () => {
          set({ toasts: get().toasts.filter((t) => t.id !== toast.id) });
        };
        const timeoutId = setTimeout(removeToast, 3000);
        return () => {
          clearTimeout(timeoutId);
          removeToast();
        };
      },
      removeToast: (id) => {
        set({ toasts: get().toasts.filter((t) => t.id !== id) });
      },
    }),
    {
      name: 'rothar-cart',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('[STORE] Rehydration error:', error);
          return;
        }
        if (state && state.items) {
          state.items = state.items.map(item => ({
            ...item,
            precio: Number(item.precio),
            cantidad: Number(item.cantidad),
          }));
        }
        state?.setHasHydrated(true);
      },
    }
  )
);
