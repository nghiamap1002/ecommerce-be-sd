"use strict";

const { NotFoundError } = require("../core/error.response");
const CommentModel = require("../models/comment.model");
const {
  findProductById,
  getProductById,
} = require("../models/repositories/product.repo");
const { convertToObjectIdMongo } = require("../utils");

class CommentService {
  static async createComment(req) {
    const { productId, content, parentCommentId } = req.body;
    const { userId } = req.user;

    const parent = await CommentModel.findById(productId);
    if (!parent) throw new NotFoundError("Not found comment for product");

    const comment = new CommentModel({
      comment_produtctId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      const parentComment = await CommentModel.findById(parentCommentId);
      if (!parentCommentId) throw new NotFoundError("parent comment not found");
      rightValue = parentComment.comment_right; // with 1 cmt this line is 4

      await CommentModel.updateMany(
        {
          comment_produtctId: convertToObjectIdMongo(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );

      await CommentModel.updateMany(
        {
          comment_produtctId: convertToObjectIdMongo(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await CommentModel.findOne(
        {
          comment_produtctId: convertToObjectIdMongo(productId),
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      );
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;
    await comment.save();
    return comment;
  }

  static async getCommentsByParentId(req) {
    const { productId, parentCommentId, limit = 50, offset = 0 } = req.query;
    if (parentCommentId) {
      const parent = await CommentModel.findById(parentCommentId);
      if (!parent) throw new NotFoundError("Not found comment for product");
      const comments = await CommentModel.find({
        comment_produtctId: convertToObjectIdMongo(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lte: parent.comment_right },
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        });

      return comments;
    }
    const comments = await CommentModel.find({
      comment_produtctId: convertToObjectIdMongo(productId),
      comment_parentId: null,
      isDeleted: false,
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({
        comment_left: 1,
      });
    return comments;
  }

  static async deleteComments(req) {
    const { commentId, productId } = req.body;
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Product not found");

    const comment = await CommentModel.findById(commentId);
    if (!comment) throw new NotFoundError("Comment not found");

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;

    const width = rightValue - leftValue + 1;

    const res = await CommentModel.updateMany(
      {
        comment_produtctId: convertToObjectIdMongo(productId),
        comment_left: { $gte: leftValue },
        comment_right: { $lte: rightValue },
        isDeleted: false,
      },
      { $set: { isDeleted: true, comment_right: 0, comment_left: 0 } }
    );

    await CommentModel.updateMany(
      {
        comment_produtctId: convertToObjectIdMongo(productId),
        comment_right: { $gt: rightValue },
        isDeleted: false,
      },
      { $inc: { comment_right: -width } }
    );

    await CommentModel.updateMany(
      {
        comment_produtctId: convertToObjectIdMongo(productId),
        comment_left: { $gt: leftValue },
        isDeleted: false,
      },
      { $inc: { comment_left: -width } }
    );

    return true;
  }

  static async Test() {
    return "abc";
  }
}

module.exports = CommentService;
