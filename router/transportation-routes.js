const express = require("express");
const router = express.Router();
const validateForm = require("../validations/validateForm");
const pool = require("../db/pool");
const { rateLimiter } = require("../validations/rateLimiters");
const session = require("express-session");
const userController = require("../controllers/user-controller");
const errorMiddleware = require("../middlewares/error-middleware");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");
const transportationController = require("../controllers/transportation-controller");

router.post("/transportation", transportationController.transportation);
router.post("/transportation-info", transportationController.getTransportationInfo);
router.post("/transportation-full-info", transportationController.getTransportationFullInfo);
router.post("/transportation-payfull", transportationController.payFullTransportations);
router.post("/transportation-no-docs", transportationController.notEnoughDocs);
router.get("/zap", transportationController.allZap);
router.post("/avr", transportationController.getDocumentsRequest);


module.exports = router;
