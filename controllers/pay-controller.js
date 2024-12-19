const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-errors");
const transportationService = require("../service/transportation-service");
const { log } = require("handlebars/runtime");
const payService = require("../service/pay-service");
class PayController {
  async getPayDays(req, res, next) {
    const { KOD } = req.body;

    try {
    //   const userData = await transportationService.transportations(KOD);

 const userData = await payService.getPayDays(KOD)

  
      res.json(userData);
    } catch (e) {
   
      next(e);
    }
  }
  
}

module.exports = new PayController();
