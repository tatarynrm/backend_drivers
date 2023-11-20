module.exports = class UserDto {
  EMAIL;
  KOD;
  PWDHASH;
  KOD_UR;
  TG_ID;

  constructor(model) {
    this.EMAIL = model.EMAIL;
    this.KOD = model.KOD;
    this.PWDHASH = model.PWDHASH;
    this.KOD_UR = model.KOD_UR;
    this.TG_ID = model.TG_ID;
  }
};
