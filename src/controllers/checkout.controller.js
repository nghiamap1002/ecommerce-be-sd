const { SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: "Checkout Review Success",
      metadata: await CheckoutService.checkoutReview(req),
    }).send(res);
  };
  checkout = async (req, res, next) => {
    new SuccessResponse({
      message: "Checkout Success",
      metadata: await CheckoutService.orderByUser(req.body),
    }).send(res);
  };
}

module.exports = new CheckoutController();
