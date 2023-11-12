const sql = require('mssql');

const config = {
    user: 'trenz',
    password: 'nhom1_2023',
    server: 'trenz.database.windows.net',
    database: 'trenz_database',
    options: {
        encrypt: true, // Use this if you're on Windows Azure
    },
};

sql.connect(config, (err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the database');
    }
});