const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dcxpkfiie",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET, // Click 'View Credentials' below to copy your API secret
});

// console.log(cloudinary.config());

module.exports = cloudinary;
