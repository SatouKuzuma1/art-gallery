import { create } from "zustand";

interface NavState {
  isActive: boolean;
  toggleActive: () => void;
  setInactive: () => void;
}

export const useNavStore = create<NavState>((set) => ({
  isActive: false,
  toggleActive: () => set((state) => ({ isActive: !state.isActive })),
  setInactive: () => set({ isActive: false }),
}));
