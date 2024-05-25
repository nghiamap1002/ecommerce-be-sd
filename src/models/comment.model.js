const { Schema, Types, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";

// Declare the Schema of the Mongo model
var commentSchema = new Schema(
  {
    comment_produtctId: {
      type: Schema.Types.ObjectId,
      ref: "Products",
    },
    comment_userId: {
      type: Schema.Types.ObjectId,
      ref: "Shops",
    },
    comment_content: {
      type: String,
      ref: "Products",
    },
    comment_left: {
      type: Number,
      default: 0,
    },
    comment_right: {
      type: Number,
      default: 0,
    },
    comment_parentId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, commentSchema);
