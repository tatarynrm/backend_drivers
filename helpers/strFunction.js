const strSel = (KOD, DATE) => {
    let s1 = `select a.kod,
        to_char(nvl(b.datzavf, b.datzav), 'dd/mm') || ' ' || 
          a.punktz || 
          decode(c1.idd, 'UA', null, ' (' || c1.idd || ')') ||
          ' - ' || 
          to_char(nvl(b.datrozvf, b.datrozv), 'dd/mm') || ' ' || 
          a.punktr ||
          decode(c2.idd, 'UA', null, ' (' || c2.idd || ')')
        as line1, 
        a.vantazh || ' ' || a.vantton || ' т.' as line2,
        a.am || ' ' || a.vod1 as line3,
        
        b.borgp,  
        a.persuma,
        d.idv,  
      
        b.datdocp,
        b.datpoplplan,
        b.datpoplfakt,
        b.pernekomplekt,
        b.peraktpret 
      from zay a
      join zaylst b on a.kod = b.kod_zay
      left join kraina c1 on a.kod_krainaz = c1.kod
      left join kraina c2 on a.kod_krainar = c2.kod
      left join valut d on b.kod_valutp = d.kod
      where a.kod_per = ${KOD} and 
          a.appdat >= TO_DATE('01.01.2024', 'DD.MM.YYYY')`

          let s2 = `and (b.borgp > 0 or b.datpoplfakt > trunc(sysdate) - 3)`
          let s3 = `and (b.borgp > 0 and b.datpoplplan = TO_DATE('${DATE}','DD.MM.YYYY'))`
        //   let s3 = `and (b.borgp > 0 or b.datpoplplan =  TO_TIMESTAMP(${DATE}, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"')`
          let s4 = `order by nvl(b.datzavf, b.datzav)`
          let s = s1;
    if (DATE) {
        s = s + ' ' + s3
    }
    else {
        s = s + ' ' + s2
    }

    s = s + ' ' + s4

    return s
}

module.exports = { strSel }