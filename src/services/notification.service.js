const NotifiModel = require("../models/notification.model");

const pushNotification = async ({
  type = "SHOP-001",
  receivedId = 1,
  senderId = 1,
  options = {},
}) => {
  let noti_content;
  if (type === "SHOP-001") {
    noti_content = "001 vừa mới thêm sản phẩm";
  } else if (type === "PROMOTION-001") {
    noti_content = "001 vừa mới thêm 1 voucher";
  }

  const newNoti = await NotifiModel.create({
    noti_type: type,
    noti_content,
    noti_reveivedId: receivedId,
    noti_senderId: senderId,
    noti_options: options,
  });

  return newNoti;
};

const listNotiByUser = async ({ userId = 1, type = "ALL", isRead = 0 }) => {
  const match = { noti_receivedId: 1 };
  if (type !== "ALL") {
    match["noti_type"] = type;
  }
  // return NotifiModel.find();
  return await NotifiModel.aggregate([
    { $match: {} },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_receivedId: 1,
        noti_content: 1,
        noti_options: 1,
        createAt: 1,
      },
    },
  ]);
};

module.exports = {
  pushNotification,
  listNotiByUser,
};
