import { create } from "zustand";

export const useIntroStore = create<{
    hideVideo: boolean;
    endIntro: () => void;
}>((set) => ({
    hideVideo: false,
    endIntro: () => set({ hideVideo: true }),
}));