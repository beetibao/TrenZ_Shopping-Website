const mssql = require('mssql');

const config = {
    user: 'trenz',
    password: 'nhom1_2023',
    server: 'trenz.database.windows.net',
    database: 'database',
    options: {
        encrypt: true, // for azure
        trustServerCertificate: false // change to true for local dev / self-signed certs
      }
};

async function getProduct(){
    let pool = await mssql.connect(config);
    let order = await pool.request().query('SELECT * from [dbo].[order]')
    return order.recordset;
}


(async () => {
    getProduct().then((result) => {
        console.log(result[2]);
        //console.log(result[2].detail);
        //const b = JSON.parse(result[2].detail);
        //console.log(b);
    });
})();