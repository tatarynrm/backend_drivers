const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-errors");
const transportationService = require("../service/transportation-service");
const { log } = require("handlebars/runtime");
class TransportationController {
  async transportation(req, res, next) {
    const { KOD } = req.body;

    try {
      const userData = await transportationService.transportations(KOD);
  
      res.json(userData.result.rows);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  async payFullTransportations(req, res, next) {
    const { KOD } = req.body;
    try {
      const userData = await transportationService.payFullTransportations(KOD);
      res.json(userData.result.rows);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  async notEnoughDocs(req, res, next) {
    const { KOD } = req.body;
    try {
      const userData = await transportationService.notEnoughDocs(KOD);
      res.json(userData.result.rows);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  async allZap(req, res, next) {
    try {
      const userData = await transportationService.getAllZap();
      // const zap = userData.filter(item => !item.ZAM)
      const items = userData.result.rows;
      // const zap = items.splice(1,1)
      const updatedArray = items.map((item) => {
        // Modify properties of the objects
        return { ...item, ZAPTEXT: "" };
      });
      res.json(updatedArray);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

 async  getTransportationInfo (req,res,next) {
  const {KOD,DATE} = req.body
  try {
    const data = await transportationService.transportationsInfo(KOD,DATE);
    res.json(data.rows)

  } catch (error) {
    
  }
 }
 async  getTransportationFullInfo (req,res,next) {
  const {KOD} = req.body
  try {
    const data = await transportationService.transportationFullInfo(KOD);
    res.json(data.rows)

  } catch (error) {
    
  }
 }
 async  getDocumentsRequest (req,res,next) {
const {KOD} = req.body;
console.log(KOD);


  try {
    const data = await transportationService.documentsInfo(KOD);
    res.json(data.rows)

  } catch (error) {
    
  }
 }


}

module.exports = new TransportationController();
