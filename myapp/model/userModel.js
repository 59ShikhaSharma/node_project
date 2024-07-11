// const jwtHelper = require('./jwtHelper'); // Adjust path as per your project structure

// async function verifyToken(req, res, next) {
//     const bearerHeader = req.headers['authorization'];
//     if (typeof bearerHeader !== 'undefined') {
//         try {
//             const bearer = bearerHeader.split(" ");
//             const token = bearer[1];
//             const authData = await jwtHelper.verifyToken(token);
//             req.authData = authData; // Attach authData to request object for further middleware or route handlers
//             next();
//         } catch (error) {
//             res.status(401).json({ error: 'Unauthorized' });
//         }
//     } else {
//         res.status(403).json({ error: 'Forbidden. Token is missing' });
//     }
// }

// module.exports = verifyToken;

const { pool } = require('../databasepg');

async function createUserTable() {
    const queryText = `
    CREATE TABLE IF NOT EXISTS customer (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50)  NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

    try {
        await pool.query(queryText);
        console.log('User table created successfully');
    } catch (err) {
        console.error('Error creating user table', err.message);
    }
}

async function createUser(username, email, password) {
    const queryText = 'INSERT INTO customer(username, email, password) VALUES ($1, $2, $3) RETURNING *';
    const values = [username, email, password];


    try {
        const result = await pool.query(queryText, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error creating user', err.message);
        throw err;
    }
}

async function getUserByUseremail(email) {
    const queryText = 'SELECT * FROM customer WHERE email = $1';
    const values = [email];

    try {
        const result = await pool.query(queryText, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error fetching user by username', err.message);
        throw err;
    }
}


module.exports = {
    createUserTable,
    createUser,
    getUserByUseremail,
};