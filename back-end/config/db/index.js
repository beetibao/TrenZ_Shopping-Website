async function Connect() {
  try {
    const mssql = require("mssql");
    const config = {
      user: "trenz",
      password: "nhom1_2023",
      server: "trenz.database.windows.net",
      database: "database",
      options: {
        encrypt: true, // for azure
        trustServerCertificate: false, // change to true for local dev / self-signed certs
      },
    };
    await mssql.connect(config);
    console.log("Connect to database successfully!");
    return [mssql, config];
  } catch (error) {
    console.log("Connect to database failure!");
  }
}
module.exports = { Connect };
