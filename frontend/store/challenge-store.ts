import { create } from "zustand";
import { ChallengeModel } from "@/types/challenge";

interface ChallengeStoreState {
  challenges: ChallengeModel[];
  activeChallenge: ChallengeModel | null;
  isLoading: boolean;
  error: string | null;
  setChallenges: (challenges: ChallengeModel[]) => void;
  addChallenge: (challenge: ChallengeModel) => void;
  setActiveChallenge: (challenge: ChallengeModel | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChallengeStore = create<ChallengeStoreState>((set) => ({
  challenges: [],
  activeChallenge: null,
  isLoading: false,
  error: null,

  setChallenges: (challenges) => set({ challenges }),
  addChallenge: (challenge) =>
    set((state) => ({ challenges: [challenge, ...state.challenges] })),
  setActiveChallenge: (challenge) => set({ activeChallenge: challenge }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
