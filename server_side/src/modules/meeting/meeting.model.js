const { pool } = require('../../config/db');

const createMeeting = async (hostId, title, roomCode) => {
    const query = `
        INSERT INTO meetings (host_id, title, room_code) 
        VALUES ($1, $2, $3)
        RETURNING id, title, room_code, host_id, status
    `;
    const result = await pool.query(query, [hostId, title, roomCode]);
    return result.rows[0];
};

const getMeetingByCode = async (roomCode) => {
    const query = `SELECT id, title, room_code, host_id, status FROM meetings WHERE room_code = $1`;
    const result = await pool.query(query, [roomCode]);
    return result.rows[0];
};

module.exports = {
    createMeeting,
    getMeetingByCode
};
