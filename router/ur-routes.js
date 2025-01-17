const express = require("express");
const urController = require("../controllers/ur-controller");
const router = express.Router();

router.post("/search", urController.getContrAgents);


router.post("/search-pre-register", urController.getContrAgentsPreRegister);


router.get("/registered-companies", urController.getAllRegisterCompanies);

// authMiddleware,
module.exports = router;
// 6821