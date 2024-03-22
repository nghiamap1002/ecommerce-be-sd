const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new cart success",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Update cart success",
      metadata: await CartService.updateCart(req.body),
    }).send(res);
  };

  deleteProudctIntoCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete cart success",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  getListCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list cart success",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
