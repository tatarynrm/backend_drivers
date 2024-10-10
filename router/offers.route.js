const express = require("express");
const offersController = require("../controllers/offers.controller");
const router = express.Router();

router.get("/", offersController.getAllOffers);
router.post("/new", offersController.createOffer);




router.post("/account-register", offersController.preRegisterAccountCreate);

router.get("/users-to-register", offersController.getAllPreRegisterUsers);


// authMiddleware,
module.exports = router;
// 6821
