const cloudinary = require("../configs/config.cloudinary");
const { BadRequestError } = require("../core/error.response");

const uploadImageFromUrl = async () => {
  try {
    const urlImage =
      "http://test.copbeo.com/_next/image?url=https%3A%2F%2Fd33yd9xuumu4kb.cloudfront.net%2Fphoto%2Fothers%2F24-06-14%2F74f0095860.png&w=1080&q=75";
    const folderName = "product",
      newFileName = "testDemo";

    const res = await cloudinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName,
    });

    return res;
  } catch (error) {
    console.log(error, "error");
  }
};

const uploadImageFromLocal = async (req) => {
  try {
    const { file } = req;
    const { fileName, type } = req.body;
    if (!file) throw new BadRequestError("File missing");
    const res = await cloudinary.uploader.upload(file.path, {
      public_id: fileName,
      folder: type,
    });

    return {
      image_url: res.secure_url,
      thumbb_url: cloudinary.url(res.public_id, {
        height: 100,
        width: 100,
        format: "jpg",
      }),
    };
  } catch (error) {
    console.log(error, "error");
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
};
