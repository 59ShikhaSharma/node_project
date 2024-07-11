// const {Client} = require("pg");

// const client = new Client({
//     host:"localhost",
//     user:"postgres",
//     port:5432,
//     password:"@DRsharma05",
//     database:"postgres"
// })

// client.connect();

// client.query(`Select * from Students`,(err,res)=> {
//     if(!err) {
//         console.log(res.rows);
//     } else {
//         console.log(err.message);
//     }
//     client.end;
// })

const { Pool } = require('pg')
const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

function connectSQLDB() {
    pool.connect(function (err) {
        if (err) throw err;
        console.log("Database Connected successfully!");
    });
}

module.exports = { connectSQLDB, pool }