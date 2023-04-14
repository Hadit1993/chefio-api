import { AddNotificationDTO } from "../dtos/notificationDto";
import { handleQueryInTransaction } from "../handlers/queryHandler";

async function addNotification(notif: AddNotificationDTO) {
  await handleQueryInTransaction(
    "INSERT INTO notifications (notif_owner, notif_type, notif_emitter, recipe_id) VALUES(?, ?, ?, ?)",
    [notif.notifOwner, notif.notifType, notif.notifEmitter, notif.recipeId]
  );
}

async function deleteNotification(notif: AddNotificationDTO) {
  let query =
    "DELETE FROM notifications WHERE notif_owner = ? AND notif_type = ? AND notif_emitter = ?";
  const values: any[] = [notif.notifOwner, notif.notifType, notif.notifEmitter];

  if (notif.notifType !== "follow") {
    query += " AND recipe_id = ?";
    values.push(notif.recipeId);
  }

  await handleQueryInTransaction(query, values);
}

const notificationsRepository = { addNotification, deleteNotification };
export default notificationsRepository;
