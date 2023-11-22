module.exports = class UserDto {
  EMAIL;
  KOD;
  PWDHASH;
  KOD_UR;
  TG_ID;
  PWD;

  constructor(model) {
    this.EMAIL = model.EMAIL;
    this.KOD = model.KOD;
    this.PWD = model.PWD;
    this.TG_ID = model.TG_ID;
    this.KOD_UR = model.KOD_UR;
    this.TG_ID = model.TG_ID;
  }
};
