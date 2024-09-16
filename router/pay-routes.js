const express = require("express");
const PayController = require("../controllers/subscribes-controller");
const payController = require("../controllers/pay-controller");
const router = express.Router();

router.post("/", payController.getPayDays);


// authMiddleware,
module.exports = router;
// 6821
