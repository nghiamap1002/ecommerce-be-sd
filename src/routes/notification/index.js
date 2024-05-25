const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const commentController = require("../../controllers/comment.controller");
const notificationController = require("../../controllers/notification.controller");

router.use(authentication);

router.get("/", asyncHandler(notificationController.getListNotiByUser));

module.exports = router;
