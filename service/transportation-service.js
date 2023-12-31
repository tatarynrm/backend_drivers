const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-errors");
const pool = require("../db/pool");
const { Result } = require("express-validator");
const { log } = require("handlebars/runtime");

class TransportationService {
  async transportations(KOD) {
    const connection = await oracledb.getConnection(pool);
    connection.currentSchema = "ICTDAT";
    const result = await connection.execute(
      `select a.kod,
      a.num,
      a.dat,
      
      a.datzav as zavdat,
      a.punktz as zavpunkt,
      c1.idd as zavkraina,
      e1.nobl as zavobl,
      a.datrozv as rozvdat,
      a.punktr as rozvpunkt,
      c2.idd as rozvkraina,
      e2.nobl as rozvobl,
      
      g.ntype as tztype,
      a.vantazh,
      a.vantobjem,
      a.vantton,
      a.km,
                                
      b.sumap as persuma,
      h2.idv as pervaluta,
      b.sumapopl,
      b.borgp,
      b.datpnpreestr,
      m2.pip as permen,
      m2.pipfull as permenpipfull,
      os_$$pkg.GetTelRobMob(a.kod_menp) as permentel,
      os_$$pkg.GetEMailSl(a.kod_menp) as permenemail,
      
      a.am,
      a.pr,
      a.vod1 || decode(a.vod1tel, null, null, ' ',a.vod1tel) as vod,
      
      b.datzavf,
      b.datrozvf,
      b.datdocp,
      b.datpoplplan,
      b.numrahp,
      b.datrahp,
      b.pernekomplekt
from zay a
left join zaylst b on a.kod = b.kod_zay
left join kraina c1 on a.kod_krainaz = c1.kod
left join kraina c2 on a.kod_krainar = c2.kod
left join obl e1 on a.kod_oblz = e1.kod
left join obl e2 on a.kod_oblr = e2.kod
left join tztype g on a.kod_tztype = g.kod
left join os j on a.kod_us = j.kod
left join dispgr k on j.kod_dispgr = k.kod
left join ur f2 on a.kod_per = f2.kod
left join valut h2 on a.kod_valutp = h2.kod
left join os m2 on a.kod_menp = m2.kod
left join v_pertype p on a.code_per = p.code

where rownum <= 50 and
     a.kod_per = ${KOD} and
     a.datprov is not null and
     a.appdat is not null and
     b.datdocp is null and
     b.pernekomplekt is null and 
     a.dat > TO_DATE('2023-01-01', 'YYYY-MM-DD') or a.dat > TO_DATE('2024-01-01', 'YYYY-MM-DD') or a.dat > TO_DATE('2025-01-01', 'YYYY-MM-DD')
     order by a.dat DESC`
    );
    return {
      result,
    };
  }
  async payFullTransportations(KOD) {
    const connection = await oracledb.getConnection(pool);
    connection.currentSchema = "ICTDAT";
    const result = await connection.execute(
      `select a.kod,
      a.num,
      a.dat,
      
      a.datzav as zavdat,
      a.punktz as zavpunkt,
      c1.idd as zavkraina,
      e1.nobl as zavobl,
      a.datrozv as rozvdat,
      a.punktr as rozvpunkt,
      c2.idd as rozvkraina,
      e2.nobl as rozvobl,
      
      g.ntype as tztype,
      a.vantazh,
      a.vantobjem,
      a.vantton,
      a.km,
                                
      b.sumap as persuma,
      h2.idv as pervaluta,
      b.sumapopl,
      b.borgp,
      b.datpnpreestr,
      m2.pip as permen,
      m2.pipfull as permenpipfull,
      os_$$pkg.GetTelRobMob(a.kod_menp) as permentel,
      os_$$pkg.GetEMailSl(a.kod_menp) as permenemail,
      
      a.am,
      a.pr,
      a.vod1 || decode(a.vod1tel, null, null, ' ',a.vod1tel) as vod,
      
      b.datzavf,
      b.datrozvf,
      b.datdocp,
      b.datpoplplan,
      b.numrahp,
      b.datrahp,
      b.pernekomplekt
from zay a
left join zaylst b on a.kod = b.kod_zay
left join kraina c1 on a.kod_krainaz = c1.kod
left join kraina c2 on a.kod_krainar = c2.kod
left join obl e1 on a.kod_oblz = e1.kod
left join obl e2 on a.kod_oblr = e2.kod
left join tztype g on a.kod_tztype = g.kod
left join os j on a.kod_us = j.kod
left join dispgr k on j.kod_dispgr = k.kod
left join ur f2 on a.kod_per = f2.kod
left join valut h2 on a.kod_valutp = h2.kod
left join os m2 on a.kod_menp = m2.kod
left join v_pertype p on a.code_per = p.code
where rownum <= 200 and
     a.kod_per = ${KOD} and
     a.datprov is not null and
     a.appdat is not null and
     b.datdocp is not null and
     b.DATPNPREESTR is not null and 
     a.dat > TO_DATE('2023-01-01', 'YYYY-MM-DD') or a.dat > TO_DATE('2024-01-01', 'YYYY-MM-DD') or a.dat > TO_DATE('2025-01-01', 'YYYY-MM-DD')
     order by a.dat DESC`
    );
    return {
      result,
    };
  }
  async notEnoughDocs(KOD) {
    const connection = await oracledb.getConnection(pool);
    connection.currentSchema = "ICTDAT";
    const result = await connection.execute(
      `select a.kod,
      a.num,
      a.dat,
      
      a.datzav as zavdat,
      a.punktz as zavpunkt,
      c1.idd as zavkraina,
      e1.nobl as zavobl,
      a.datrozv as rozvdat,
      a.punktr as rozvpunkt,
      c2.idd as rozvkraina,
      e2.nobl as rozvobl,
      
      g.ntype as tztype,
      a.vantazh,
      a.vantobjem,
      a.vantton,
      a.km,
                                
      b.sumap as persuma,
      h2.idv as pervaluta,
      b.sumapopl,
      b.borgp,
      b.datpnpreestr,
      m2.pip as permen,
      m2.pipfull as permenpipfull,
      os_$$pkg.GetTelRobMob(a.kod_menp) as permentel,
      os_$$pkg.GetEMailSl(a.kod_menp) as permenemail,
      
      a.am,
      a.pr,
      a.vod1 || decode(a.vod1tel, null, null, ' ',a.vod1tel) as vod,
      
      b.datzavf,
      b.datrozvf,
      b.datdocp,
      b.datpoplplan,
      b.numrahp,
      b.datrahp,
      b.pernekomplekt
from zay a
left join zaylst b on a.kod = b.kod_zay
left join kraina c1 on a.kod_krainaz = c1.kod
left join kraina c2 on a.kod_krainar = c2.kod
left join obl e1 on a.kod_oblz = e1.kod
left join obl e2 on a.kod_oblr = e2.kod
left join tztype g on a.kod_tztype = g.kod
left join os j on a.kod_us = j.kod
left join dispgr k on j.kod_dispgr = k.kod
left join ur f2 on a.kod_per = f2.kod
left join valut h2 on a.kod_valutp = h2.kod
left join os m2 on a.kod_menp = m2.kod
left join v_pertype p on a.code_per = p.code
where 
     a.kod_per = ${KOD} and
     b.pernekomplekt is not null and 
     b.datdocp is not null and 
     a.dat > TO_DATE('2023-01-01', 'YYYY-MM-DD') or a.dat > TO_DATE('2024-01-01', 'YYYY-MM-DD') or a.dat > TO_DATE('2025-01-01', 'YYYY-MM-DD')
     order by a.dat DESC`
    );
    console.log(result.rows);
    return {
      result,
    };
  }

  async getAllZap() {
    const connection = await oracledb.getConnection(pool);
    connection.currentSchema = "ICTDAT";

    try {
      const result = await connection.execute(
        `SELECT a.*,
          l.kilamzakr,
          l.kilamact,
          b.pip,
          b.pipfull,
          c.TELEGRAMID,
          k.idgmap as kraina,
          os_$$pkg.GetTelRobMob(a.kod_os) as permentel,
          os_$$pkg.GetEMailSl(a.kod_os) as permenemail,
          c1.idd as zavkraina,
          c2.idd as rozvkraina
       
      FROM zap a
      JOIN OS b on a.kod_os = b.kod
      JOIN US c on a.kod_os = c.kod_os
      left join kraina k on a.kod_kraina = k.kod
      left join zaplst l on a.kod = l.kod_zap
      left join kraina c1 on a.kod_krainaz = c1.kod
      left join kraina c2 on a.kod_krainar = c2.kod
      WHERE a.status = 0`
      );
      console.log(result);
      return {
        result,
      };
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new TransportationService();
