const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const discountController = require("../../controllers/discount.controller");

router.post("/amount", asyncHandler(discountController.getDiscountAmount));
router.get(
  "/list-product",
  asyncHandler(discountController.getAllDiscountWithProduct)
);

router.use(authentication);

router.post("", asyncHandler(discountController.createDiscount));
router.get("", asyncHandler(discountController.getAllDiscountCodeByShop));
module.exports = router;
