export type NotifType = "follow" | "like" | "comment";

export interface AddNotificationDTO {
  notifOwner: number;
  notifType: NotifType;
  notifEmitter: number;
  recipeId?: number;
}
