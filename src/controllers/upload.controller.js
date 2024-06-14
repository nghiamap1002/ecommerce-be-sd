const { SuccessResponse } = require("../core/success.response");
const {
  uploadImageFromUrl,
  uploadImageFromLocal,
} = require("../services/upload.service");
const { BadRequestError } = require("../core/error.response");

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: "Upload file success",
      metadata: await uploadImageFromUrl(),
    }).send(res);
  };

  uploadFileThumbnail = async (req, res, next) => {
    new SuccessResponse({
      message: "Upload thumbnail success",
      metadata: await uploadImageFromLocal(req),
    }).send(res);
  };
}

module.exports = new UploadController();
