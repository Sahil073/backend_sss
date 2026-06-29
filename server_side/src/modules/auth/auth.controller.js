const { successResponse, errorResponse } = require('../../utils/apiResponse');
const authService = require('./auth.service');

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return errorResponse(res, 'MISSING_FIELDS', 'Name, email, and password are required', 400);
        }
        const data = await authService.register(name, email, password);
        
        return successResponse(res, data, 201);
    } catch (error) {
        next(error); 
    }
};


const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return errorResponse(res, 'MISSING_FIELDS', 'Email and password are required', 400);
        }
        const data = await authService.login(email, password);
        
        return successResponse(res, data, 200);
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        // req.user comes directly from the authMiddleware!
        return successResponse(res, req.user, 200);
    } catch (error) {
        next(error);
    }
};
module.exports = {
    registerUser,
    loginUser,
    getMe
};