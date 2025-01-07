const express = require("express");
const visitController = require("../controllers/visit-controller");
const router = express.Router();

router.post("/record", visitController.visitRecord);
router.post("/visits", visitController.getCompanyVisit);
router.get("/visits-all", visitController.visitAllData);


// authMiddleware,
module.exports = router;
// 6821