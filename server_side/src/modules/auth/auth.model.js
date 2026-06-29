const { pool } = require('../../config/db');

const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1'
        , [email]);
    return result.rows[0];
};

const createUser = async (name, email, hashedPassword) => {
    const query = `
        INSERT INTO users (name, email, password_hash) 
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
    `;
    const result = await pool.query(query, [name, email, hashedPassword]);
    return result.rows[0];
}
module.exports = {
    findUserByEmail,
    createUser
}