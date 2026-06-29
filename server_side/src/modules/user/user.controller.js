const userService = require('./user.service')
const {successResponse} = require('../../utils/apiResponse')

const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getProfile(req.user.userId)
        return successResponse(res, {user})
    } catch (err) {
        next(err)
    }
}

const updateProfile = async (req, res, next) => {
    try {
        const {name, avatarUrl } = req.body
        const updatedUser = await userService.updateProfile(
            req.user.userId, 
            name, 
            avatarUrl
        )
        return successResponse(res, {user: updatedUser})
    } catch (err) {
        next (err)
    }
}

module.exports = {getProfile, updateProfile}