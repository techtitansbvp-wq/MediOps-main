import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DemoState {
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  toggleDemoMode: () => void;
}

export const useDemoMode = create<DemoState>()(
  persist(
    (set) => ({
      isDemoMode: false,
      setDemoMode: (enabled) => set({ isDemoMode: enabled }),
      toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),
    }),
    {
      name: "medi-ops-demo-mode",
    }
  )
);
