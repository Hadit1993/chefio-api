import { NotifType } from "../dtos/notificationDto";

export default interface AddNotificationDTO {
  notifId: number;
  notifOwner: number;
  notifType: NotifType;
  notifEmitter: number;
  notifDate: Date;
  recipeId?: number;
  notifIsRead: boolean;
}
