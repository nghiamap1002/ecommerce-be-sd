const { SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");
const { listNotiByUser } = require("../services/notification.service");

class NotificationController {
  getListNotiByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list noti success",
      metadata: await listNotiByUser(req),
    }).send(res);
  };
}

module.exports = new NotificationController();
