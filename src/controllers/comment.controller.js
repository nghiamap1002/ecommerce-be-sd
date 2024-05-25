const { SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: "Create comment success",
      metadata: await CommentService.createComment(req),
    }).send(res);
  };

  getCommentsByParentId = async (req, res, next) => {
    new SuccessResponse({
      message: "Get comments success",
      metadata: await CommentService.getCommentsByParentId(req),
    }).send(res);
  };

  deleteCommentById = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete comments success",
      metadata: await CommentService.deleteComments(req),
    }).send(res);
  };
}

module.exports = new CommentController();
