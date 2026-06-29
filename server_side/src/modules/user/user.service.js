const userModel = require('./user.model')

const getProfile = async (userId) => {
    const user = await userModel.getUserById(userId)

    if(!user) {
        const err = new Error('User Not found')
        err.code = 'NOT_FOUND'
        err.status = 404
        throw err
    }

    return user
    
}

const updateProfile = async (userId, name, avatarUrl) => {
    if(!name || !name.trim()) {
        const err = new Error('Name cannot be empty')
        err.code = 'VALIDATION_ERROR'
        err.status = 400
        throw err 
    }
    const updatedUser = await userModel.updateUserProfile(
        userId, 
        name.trim(),
        avatarUrl || null 
    )
    return updatedUser 
}

module.exports = {getProfile, updateProfile}