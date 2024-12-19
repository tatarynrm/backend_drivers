const OracleDB = require("oracledb");
const UrService = require("../service/ur-service");
const pool = require("../db/pool");

class UrController {
  getContrAgents = async (req, res) => {
    const { search } = req.body;
    try {
      const connection = await OracleDB.getConnection(pool);
      const result = await connection.execute(
        `select * from ictdat.ur 
            WHERE NDOV LIKE '${search}%'
            OR NDOV LIKE '$${search}'
            OR NDOV LIKE '${search}'
            OR ZKPO LIKE '${search}'
            OR ZKPO LIKE '${search}$'
            OR ZKPO LIKE '$${search}'
            OR UPPER( NDOV ) LIKE '${search}%'
            OR UPPER( NDOV ) LIKE '%${search}_%'
            OR UPPER( NDOV ) LIKE '% ${search}'
            OR UPPER( NDOV ) LIKE '%${search} %'
            OR LOWER( NDOV ) LIKE '${search}%'
            OR LOWER( NDOV ) LIKE '%${search} %'
            OR LOWER( NDOV ) LIKE '%_${search}'
            OR LOWER( NDOV ) LIKE '%${search} %'
            OR NDOV LIKE '%_${search}_%'
            OR NDOV LIKE '${search}_%'
            OR NDOV LIKE '%_${search}'
            OR NDOV LIKE '_${search}'
            OR NDOV LIKE '_${search}_'
            OR NDOV LIKE '${search}_'
            OR NDOV LIKE '${search}_%'
            `
      );
      res.status(200).json(result.rows);
      if (!result) {
        res.status(401).json({ message: "error" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  getContrAgentsPreRegister = async (req, res) => {
    const { email, phone_number, company } = req.body;
  

    try {
      const connection = await OracleDB.getConnection(pool);
      const resultNameOrKodCheck = await connection.execute(
        `SELECT * FROM ictdat.ur WHERE UPPER(ZKPO) = UPPER(:company) OR UPPER(NDOV) LIKE UPPER(:companyPattern)`,
        {
          company: company,
          companyPattern: `%${company}%`,
        }
      );
      const resultPhoneCheck = await connection.execute(
        `SELECT a.*,b.NKONTAKT as contact_name,b.PRIM as who,c.NDOV as COMPANY_NAME
             FROM ictdat.KONTAKTVAL a
             left join ictdat.kontakt b on a.KOD_KONTAKT = b.KOD
             left join ictdat.ur c on b.KOD_UR = c.KOD
             WHERE (VAL = :searchTerm OR VALIDX = :searchTerm 
                   OR REPLACE(REPLACE(VALIDX, '(', ''), ')', '') = :searchTerm 
                   OR REPLACE(REPLACE(VAL, '(', ''), ')', '') = :searchTerm)
                OR LOWER(VAL) = LOWER(:searchTerm)
                OR LOWER(VALIDX) = LOWER(:searchTerm)`,
        {
          searchTerm: phone_number,
        }
      );
      const resultEmailCheck = await connection.execute(
        `SELECT a.*,b.NKONTAKT as contact_name,b.PRIM as who,c.NDOV as COMPANY_NAME
             FROM ictdat.KONTAKTVAL a
             left join ictdat.kontakt b on a.KOD_KONTAKT = b.KOD
             left join ictdat.ur c on b.KOD_UR = c.KOD
             WHERE (VAL = :searchTerm OR VALIDX = :searchTerm 
                   OR REPLACE(REPLACE(VALIDX, '(', ''), ')', '') = :searchTerm 
                   OR REPLACE(REPLACE(VAL, '(', ''), ')', '') = :searchTerm)
                OR LOWER(VAL) = LOWER(:searchTerm)
                OR LOWER(VALIDX) = LOWER(:searchTerm)`,
        {
          searchTerm: email,
        }
      );
  

      res.status(200).json({
        name_kod: resultNameOrKodCheck.rows,
        phone: resultPhoneCheck.rows,
        email: resultEmailCheck.rows,
      });
    } catch (error) {
      console.log(error);
    }
  };

  getAllRegisterCompanies = async (req, res) => {
    const connection = await OracleDB.getConnection(pool);
    try {
      const data = await connection.execute(`
      SELECT DISTINCT b.NUR
FROM ICTDAT.PERUS a
LEFT JOIN ICTDAT.UR b ON a.KOD_UR = b.KOD
        `);

      res.status(200).json(data.rows);
    } catch (error) {}
  };
}

module.exports = new UrController();
