const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const {
  BadRequestError,
  AuthFailureError,
  NotFoundError,
} = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.services");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  const accessToken = jwt.sign(payload, publicKey, {
    // algorithm: "RS256",
    expiresIn: "2d",
  });
  const refreshToken = jwt.sign(payload, privateKey, {
    // algorithm: "RS256",
    expiresIn: "7d",
  });

  jwt.verify(accessToken, publicKey, (err, decode) => {
    if (err) {
      console.error("err", err);
    } else {
      console.error("decode", decode);
    }
  });
  return { accessToken, refreshToken };
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not Found Keystore");

  const refreshToken = req.headers[HEADER.REFRESHTOKEN];

  if (refreshToken) {
    try {
      const decodeRefreshToken = jwt.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeRefreshToken.userId)
        throw new AuthFailureError("Invalid Userid");
      req.refreshToken = refreshToken;
      req.user = decodeRefreshToken;
      req.keyStore = keyStore;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  try {
    const decodeAccessToken = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeAccessToken.userId)
      throw new AuthFailureError("Invalid Userid");
    req.user = decodeAccessToken;
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return jwt.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
