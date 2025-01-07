const express = require("express");

const modalsController = require("../controllers/modals.controller");
const router = express.Router();

router.post("/get-check", modalsController.createModalCheckIfNotExist);

router.get('/get-all',modalsController.getAllModals)





// authMiddleware,
module.exports = router;
// 6821
