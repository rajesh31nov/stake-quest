import { NetworkType } from "./wallet";

export interface UserNotificationSettings {
  emailNotifications: boolean;
  inAppAlerts: boolean;
  challengeInvitations: boolean;
  proofSubmissions: boolean;
  rewardPayouts: boolean;
}

export interface UserSettingsState {
  network: NetworkType;
  customRpcUrl: string;
  autoConnect: boolean;
  notifications: UserNotificationSettings;
}
