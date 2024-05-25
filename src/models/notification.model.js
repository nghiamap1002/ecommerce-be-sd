const { Schema, Types, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

// Declare the Schema of the Mongo model
var notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      //   enum: ["PROMOTION" , ""] customize noti type
      enum: [
        "ORDER-001",
        "ORDER-002",
        "PROMOTION-001",
        "PROMOTION-002",
        "SHOP-001",
      ],
      require: true,
    },
    noti_senderId: {
      type: Schema.Types.ObjectId,
      ref: "Shops",
      require: true,
    },
    noti_receivedId: {
      //   type: Schema.Types.ObjectId,
      type: Number,
      require: true,
      ref: "Shops",
    },
    noti_content: {
      type: String,
      require: true,
    },
    noti_options: {
      type: Object,
      default: {},
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, notificationSchema);
