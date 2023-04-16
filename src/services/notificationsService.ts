import { NotificationResultDto } from "../dtos/notificationDto";
import { Paginate } from "../generalTypes";
import notificationsRepository from "../repository/notificationsRepository";

async function getNotifications(
  paginate: Required<Paginate>,
  userId: number
): Promise<NotificationResultDto[]> {
  const notifs = await notificationsRepository.getNotifications(
    paginate,
    userId
  );
  await notificationsRepository.readNotifications(
    notifs.map((val) => val.notifId)
  );
  return notifs;
}

const notificationsService = { getNotifications };

export default notificationsService;
