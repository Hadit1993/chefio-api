import {
  AddNotificationDTO,
  NotificationResultDto,
} from "../dtos/notificationDto";
import { Paginate } from "../generalTypes";
import handleQuery, {
  handleQueryInTransaction,
} from "../handlers/queryHandler";
import { snakeToCamel } from "../transformers/snakeToCamelTransformer";

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

async function getNotifications(
  paginate: Required<Paginate>,
  userId: number
): Promise<NotificationResultDto[]> {
  const page = parseInt(paginate.page);
  const limit = parseInt(paginate.limit);
  const offset = (page - 1) * limit;

  const notifs: any[] = await handleQuery(
    `
    SELECT notifications.*, users.user_id, users.username, users.profile_image, recipes.recipe_cover_image 
    FROM notifications 
    JOIN users ON notifications.notif_emitter = users.user_id 
    JOIN recipes ON recipes.recipe_id = notifications.recipe_id
    WHERE notifications.notif_owner = ? 
    ORDER BY notif_date DESC
    LIMIT ? OFFSET ?
    `,
    [userId, limit, offset]
  );

  const transformedNotifs = notifs.map((val) => {
    const transformed: any = snakeToCamel(val);
    const {
      notifOwner,
      notifEmitter,
      userId,
      username,
      profileImage,
      recipeId,
      recipeCoverImage,
      ...rest
    } = transformed;
    return {
      ...rest,
      notifEmitter: { userId, username, profileImage },
      recipe: { recipeId, recipeCoverImage },
    };
  });

  return transformedNotifs;
}

async function readNotifications(notifIds: number[]) {
  await handleQuery(
    "UPDATE notifications SET notif_is_read = true WHERE notif_id in (?)",
    [notifIds]
  );
}

const notificationsRepository = {
  addNotification,
  deleteNotification,
  getNotifications,
  readNotifications,
};
export default notificationsRepository;
