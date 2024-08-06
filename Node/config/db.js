const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'pavan0569',
    database: 'ZoomCar'
});

module.exports = pool.promise();
