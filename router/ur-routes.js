const express = require("express");
const urController = require("../controllers/ur-controller");
const router = express.Router();

router.post("/search", urController.getContrAgents);

// authMiddleware,
module.exports = router;
// 6821