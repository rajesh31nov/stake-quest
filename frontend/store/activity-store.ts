import { create } from "zustand";
import { SorobanContractEvent, EventCategory } from "@/types/event";
import { eventsService } from "@/services/events-service";

interface ActivityStoreState {
  events: SorobanContractEvent[];
  selectedCategory: EventCategory;
  isLoading: boolean;
  error: string | null;
  setCategory: (category: EventCategory) => void;
  fetchEvents: () => Promise<void>;
  addEvent: (event: SorobanContractEvent) => void;
}

export const useActivityStore = create<ActivityStoreState>((set, get) => ({
  events: [],
  selectedCategory: "ALL",
  isLoading: false,
  error: null,

  setCategory: (selectedCategory) => set({ selectedCategory }),

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const fetchedEvents = await eventsService.fetchContractEvents();
      set({ events: fetchedEvents, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || "Failed to stream contract events.",
        isLoading: false,
      });
    }
  },

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events.filter((e) => e.id !== event.id)],
    })),
}));
