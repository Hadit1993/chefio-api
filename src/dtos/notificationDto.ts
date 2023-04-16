export type NotifType = "follow" | "like" | "comment";

export interface AddNotificationDTO {
  notifOwner: number;
  notifType: NotifType;
  notifEmitter: number;
  recipeId?: number;
}

export interface NotificationResultDto {
  notifId: number;
  notifType: NotifType;
  notifEmitter: {
    user_id: number;
    username: string;
    profileImage?: string;
  };
  recipe?: {
    recipeId: number;
    recipeCoverImage: string;
  };
  notifIsRead: boolean;
  notifDate: Date;
}
