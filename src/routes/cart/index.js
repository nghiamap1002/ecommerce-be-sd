const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const cartController = require("../../controllers/cart.controller");

router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.deleteProudctIntoCart));
router.post("/update", asyncHandler(cartController.updateCart));
router.get("", asyncHandler(cartController.getListCart));

// router.use(authentication);

module.exports = router;
