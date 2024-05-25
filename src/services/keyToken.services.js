const { Types } = require("mongoose");
const keyTokenModel = require("../models/keyToken.model");
const { convertToObjectIdMongo } = require("../utils");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken = null,
  }) => {
    try {
      // const publicKeyString = publicKey.toString();
      // const token = await keyTokenModel.create({
      //   user: userId,
      //   publicKey: publicKeyString,
      //   privateKey,
      // });
      // return token ? token.publicKey : null;
      const filter = { user: userId };

      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };

      const options = { upsert: true, new: true };

      const token = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return token ? token.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({
      user: convertToObjectIdMongo(userId),
    });
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.findByIdAndDelete(id);
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken: refreshToken });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static deleteKeyByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({
      user: new Types.ObjectId(userId),
    });
  };
}

module.exports = KeyTokenService;
