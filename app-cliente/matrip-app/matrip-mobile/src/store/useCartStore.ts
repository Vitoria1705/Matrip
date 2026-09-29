import { create } from 'zustand';
import { CartItem } from '../types/adventure';

interface CartStore {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: CartItem) => void;
  updateQuantity: (index: number, delta: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cartItems: [],
  isCartOpen: false,

  addToCart: (newItem) => set((state) => {
    const existingIndex = state.cartItems.findIndex(
      (item) => item.id === newItem.id
    );

    if (existingIndex >= 0) {
      const updated = [...state.cartItems];
      updated[existingIndex].quantity += newItem.quantity;
      return { cartItems: updated, isCartOpen: true };
    }

    return { cartItems: [...state.cartItems, newItem], isCartOpen: true };
  }),

  updateQuantity: (index, delta) => set((state) => {
    const updated = [...state.cartItems];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    return { cartItems: updated };
  }),

  removeItem: (index) => set((state) => {
    const updated = [...state.cartItems];
    updated.splice(index, 1);
    return { cartItems: updated };
  }),

  clearCart: () => set({ cartItems: [] }),
  setCartOpen: (open) => set({ isCartOpen: open }),
}));
