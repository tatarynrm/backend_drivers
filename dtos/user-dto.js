module.exports = class UserDto {
  EMAIL;
  KOD;
  PWDHASH;
  KOD_UR;
  TG_ID;
  PWD;
  PHONE_NUMBER;
  TG_NOT;
  EMAILNOT;
  ISADMIN;
  PERADMIN;
  PRIZV;
  NAME;
  POBAT;
 

  constructor(model) {
    this.EMAIL = model.EMAIL;
    this.KOD = model.KOD;
    this.PWD = model.PWD;
    this.TG_ID = model.TG_ID;
    this.KOD_UR = model.KOD_UR;
    this.TG_ID = model.TG_ID;
    this.PHONE_NUMBER = model.PHONE_NUMBER;
    this.TG_NOT = model.TG_NOT;
    this.EMAILNOT = model.EMAILNOT;
    this.ISADMIN = model.ISADMIN;
    this.PERADMIN = model.PERADMIN;
    this.PRIZV = model.PRIZV;
    this.NAME = model.NAME;
    this.POBAT = model.POBAT;

  }
};
