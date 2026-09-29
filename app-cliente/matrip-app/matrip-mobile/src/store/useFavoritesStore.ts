import { create } from 'zustand';
import type { Adventure } from '../types/adventure';

interface FavoritesStore {
  favorites: Adventure[];
  toggleFavorite: (adventure: Adventure) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],
  toggleFavorite: (adventure) => set((state) => {
    const exists = state.favorites.some(f => f.id === adventure.id);
    if (exists) {
      return { favorites: state.favorites.filter(f => f.id !== adventure.id) };
    } else {
      return { favorites: [...state.favorites, adventure] };
    }
  }),
  isFavorite: (id) => get().favorites.some(f => f.id === id),
}));
