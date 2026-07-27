import { UserSettingsState } from "@/types/settings";

const STORAGE_KEY = "stakequest_user_settings";

export const DEFAULT_SETTINGS: UserSettingsState = {
  network: "TESTNET",
  customRpcUrl: "https://soroban-testnet.stellar.org",
  autoConnect: true,
  notifications: {
    emailNotifications: false,
    inAppAlerts: true,
    challengeInvitations: true,
    proofSubmissions: true,
    rewardPayouts: true,
  },
};

export class SettingsService {
  public loadSettings(): UserSettingsState {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_SETTINGS;
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public saveSettings(settings: UserSettingsState): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error("Failed to save settings to localStorage:", err);
    }
  }
}

export const settingsService = new SettingsService();
