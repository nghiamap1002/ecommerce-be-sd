const apiKeyModel = require("../models/apiKey.model");
const crypto = require("node:crypto");
const findById = async (key) => {
  //   console.log(newKey, "newKey");
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  if (!objKey) {
    return await apiKeyModel.create({
      key: crypto.randomBytes(64).toString("hex"),
      permissions: ["0000"],
    });
  }
  return objKey;
};

module.exports = { findById };
