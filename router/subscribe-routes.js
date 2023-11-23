const express = require("express");
const SubscribeController = require("../controllers/subscribes-controller");
const router = express.Router();

router.post("/email-not", SubscribeController.emailSubscribe);
router.post("/tg-not", SubscribeController.tgSubscribe);

// authMiddleware,
module.exports = router;
// 6821
