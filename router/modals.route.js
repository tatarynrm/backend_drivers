const express = require("express");

const modalsController = require("../controllers/modals.controller");
const router = express.Router();

router.post("/get-check", modalsController.createModalCheckIfNotExist);







// authMiddleware,
module.exports = router;
// 6821
