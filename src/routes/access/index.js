const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

router.post("/signup", asyncHandler(accessController.signUp));
router.post("/login", asyncHandler(accessController.login));

router.use(authentication);

router.post("/logout", asyncHandler(accessController.logout));
router.post("/refreshtoken", asyncHandler(accessController.handleRefreshToken));
module.exports = router;
