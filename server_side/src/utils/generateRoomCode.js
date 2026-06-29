const crypto = require('crypto')
const {pool} = require('../config/db')

const CHARACTERS = 'abcdefghjkmnpqrstuvwxyz23456789'

const generateRoomCode = async () => {
    while(true) {
        const code = Array.from(crypto.randomBytes(8)).map(byte => CHARACTERS[byte % CHARACTERS.length]).join('')

        const result = await pool.query(
            'SELECT id FROM meetings WHERE room_code = $1', [code]
        )
        if(result.rows.length === 0){
            return code
        }
    }
}

module.exports = generateRoomCode