const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const commentController = require("../../controllers/comment.controller");

router.use(authentication);

router.post("/", asyncHandler(commentController.createComment));
router.get("/", asyncHandler(commentController.getCommentsByParentId));
router.delete("/", asyncHandler(commentController.deleteCommentById));

module.exports = router;
