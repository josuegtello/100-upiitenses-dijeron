import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: 'localhost',
    user: 'eder',
    password: 'dacgaf-8vuqse-Japjip',
    database: '100upittenses_dijeron',
    waitForConnections: true,
    connectionLimit: 5
});

export default pool;
