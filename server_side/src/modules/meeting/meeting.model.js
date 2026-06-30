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

const getMeetingsByHostId = async (hostId) => {
    const query = `SELECT id, title, room_code, host_id, status FROM meetings WHERE host_id= $1 
    ORDER BY created_at DESC`
    const result = await pool.query(query, [hostId])
    return result.rows
}

module.exports = {
    createMeeting,
    getMeetingByCode,
    getMeetingsByHostId
};
