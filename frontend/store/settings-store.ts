import { create } from "zustand";
import { UserSettingsState, UserNotificationSettings } from "@/types/settings";
import { settingsService, DEFAULT_SETTINGS } from "@/services/settings-service";
import { NetworkType } from "@/types/wallet";

interface SettingsStoreActions {
  setNetwork: (network: NetworkType) => void;
  setCustomRpcUrl: (url: string) => void;
  setAutoConnect: (autoConnect: boolean) => void;
  updateNotifications: (partial: Partial<UserNotificationSettings>) => void;
  loadSavedSettings: () => void;
}

export const useSettingsStore = create<UserSettingsState & SettingsStoreActions>((set, get) => ({
  ...DEFAULT_SETTINGS,

  setNetwork: (network) => {
    set({ network });
    settingsService.saveSettings(get());
  },

  setCustomRpcUrl: (customRpcUrl) => {
    set({ customRpcUrl });
    settingsService.saveSettings(get());
  },

  setAutoConnect: (autoConnect) => {
    set({ autoConnect });
    settingsService.saveSettings(get());
  },

  updateNotifications: (partial) => {
    set((state) => ({
      notifications: {
        ...state.notifications,
        ...partial,
      },
    }));
    settingsService.saveSettings(get());
  },

  loadSavedSettings: () => {
    const loaded = settingsService.loadSettings();
    set(loaded);
  },
}));
