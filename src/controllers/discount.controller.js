const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscount = async (req, res, next) => {
    new SuccessResponse({
      message: "Create Discount Success",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodeByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get All Discount Success",
      metadata: await DiscountService.getAllDiscountByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Create Discount Success",
      metadata: await DiscountService.getDiscoutAmount({
        ...req.body,
      }),
    }).send(res);
  };

  getAllDiscountWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create Discount Success",
      metadata: await DiscountService.getAllDiscountWithProductId({
        ...req.query,
      }),
    }).send(res);
  };

  getAllDiscountByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Create Discount Success",
      metadata: await DiscountService.getAllDiscountByShop({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
