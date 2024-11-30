const express = require("express");
const visitController = require("../controllers/visit-controller");
const router = express.Router();

router.post("/record", visitController.visitRecord);


// authMiddleware,
module.exports = router;
// 6821