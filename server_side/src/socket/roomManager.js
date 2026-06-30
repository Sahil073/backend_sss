const { redisClient } = require('../config/redis')
const ROOM_TTL_SECONDS = 3600
const addParticipant = async (roomCode, userId, data) => {
    const key = `room:${roomCode}`

    await redisClient.hSet(key, userId, JSON.stringify(data))

    await redisClient.expire(key, ROOM_TTL_SECONDS)
}

const removeParticipant = async (roomCode, userId) => {
    await redisClient.hDel(`room:${roomCode}`, userId)
}

const getParticipants = async (roomCode) => {
    const raw = await redisClient.hGetAll( `room:${roomCode}`)

    if(!raw || Object.keys(raw).length == 0) return []

    return Object.entries(raw).map(([userId, jsonString]) => ({
        userId,
        ...JSON.parse(jsonString)
    }))
}

const updateParticipant = async (roomCode, userId, updates) => {
    const key = `room:${roomCode}`

    const existing = await redisClient.hGet(key, userId)

    if(!existing) return

    const merged = {...JSON.parse(existing), ...updates}

    await redisClient.hSet(key, userId, JSON.stringify(merged))
}

const deleteRoom = async (roomCode) => {
    await redisClient.del(`room:${roomCode}`)
}

const getSocketId = async (roomCode, userId) => {
    const raw = await redisClient.hGet(`room:${roomCode}`, userId)
    if(!raw) return null
    const data = JSON.parse(raw)
    return data.socketId
}

module.exports = {
    addParticipant,
    removeParticipant,
    getParticipants,
    updateParticipant,
    deleteRoom,
    getSocketId
}