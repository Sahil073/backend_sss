const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/env')
const {errorResponse} = require('../utils/apiResponse')

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 'TOKEN_INVALID', 'No token provided', 401)
    }

    const token = authHeader.split(' ')[1]
    try{
        const decoded= jwt.verify(token, JWT_SECRET)
        req.user = decoded
        next()
    }catch (err){
        return errorResponse(res, 'TOKEN_INVALID', 'Token is invalid or expired', 401)
    }
}

module.exports = auth 