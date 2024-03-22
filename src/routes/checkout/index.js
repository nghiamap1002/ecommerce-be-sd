const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const checkoutController = require("../../controllers/checkout.controller");

router.post("/review", asyncHandler(checkoutController.checkoutReview));

// router.use(authentication);

module.exports = router;
