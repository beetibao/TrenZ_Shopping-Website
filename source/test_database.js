const mssql = require('mssql');

const config = {
    user: 'trenz',
    password: 'nhom1_2023',
    server: 'trenz.database.windows.net',
    database: 'database'
};

async function getProduct(){
    let pool = await mssql.connect(config);
    let product = await pool.request().query("SELECT * from product")
    return product.recordset;
}

(async () => {
    getProduct().then((result) => {
        console.log(result);
    });
})();