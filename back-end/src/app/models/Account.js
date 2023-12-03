const mssql = require("mssql");
const config = {
    user: "trenz",
    password: "nhom1_2023",
    server: "trenz.database.windows.net",
    database: "database",
    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
};