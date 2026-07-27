import { describe, it, expect } from "vitest";
import { useSettingsStore } from "@/store/settings-store";

describe("Settings Store", () => {
  it("should initialize with default TESTNET network", () => {
    const state = useSettingsStore.getState();
    expect(state.network).toBe("TESTNET");
    expect(state.notifications.inAppAlerts).toBe(true);
  });

  it("should update network and notification preferences", () => {
    useSettingsStore.getState().setNetwork("FUTURENET");
    expect(useSettingsStore.getState().network).toBe("FUTURENET");

    useSettingsStore.getState().updateNotifications({ inAppAlerts: false });
    expect(useSettingsStore.getState().notifications.inAppAlerts).toBe(false);
  });
});
