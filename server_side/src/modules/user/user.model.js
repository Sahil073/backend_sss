const {pool} = require('../../config/db')

const getUserById = async (userId) =>{
    const result = await pool.query(
        'SELECT id, name, email, avatar_url, created_at FROM users WHERE id = $1', [userId]
    )
 
   return result.row[0]
}

const updateUserProfile = async (userId, name, avatarUrl) => {
    const result = await pool.query(
        'UPDATE users SET name = $1, avatar_url = $2 WHERE id = $3 RETURNING id, name, email, avatar_url, created_at', [name, avatarUrl, userId]
    )
    return result.rows[0]
}

module.exports = {getUserById, updateUserProfile}