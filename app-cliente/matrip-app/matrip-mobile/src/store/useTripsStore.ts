import { create } from 'zustand';

export interface Trip {
  id: string;
  title: string;
  location: string;
  date: string;
  status: 'confirmado' | 'concluido';
  image: string;
}

interface TripsStore {
  trips: Trip[];
  addTrip: (trip: Trip) => void;
}

export const useTripsStore = create<TripsStore>((set) => ({
  trips: [], // Começa vazio, sem os dados de exemplo (mock)
  addTrip: (trip) => set((state) => ({ trips: [...state.trips, trip] })),
}));
