import BaseResponse from "../dtos/BaseResponse";
import { Paginate } from "../generalTypes";
import notificationsService from "../services/notificationsService";
import tryRequest from "../utils/tryRequest";

const getNotifications = tryRequest(async (req, res, _) => {
  const { page = "1", limit = "20" } = req.query as Paginate;
  const userId = req.userId;

  const notifications = await notificationsService.getNotifications(
    {
      page,
      limit,
    },
    userId!
  );

  return res.json(new BaseResponse(notifications));
});

const notificationsController = { getNotifications };

export default notificationsController;
