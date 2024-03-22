const { convertToObjectIdMongo } = require("../../utils");
const { cartModel } = require("../cart.model");

const findCartById = async (cartId) => {
  return await cartModel
    .findOne({
      _id: convertToObjectIdMongo(cartId),
      cart_state: "active",
    })
    .lean();
};

module.exports = {
  findCartById,
};
