const { successResponse, errorResponse } = require('../../utils/apiResponse');
const meetingService = require('./meeting.service');

const createInstantMeeting = async (req, res, next) => {
    try {
        const hostId = req.user.userId; 
        const meeting = await meetingService.createMeeting(hostId, "Instant Meeting");
        return successResponse(res, meeting, 201);
    } catch (error) {
        next(error);
    }
};

const createScheduledMeeting = async (req, res, next) => {
    try {
        const hostId = req.user.userId;
        const { title } = req.body;
        
        if (!title) {
            return errorResponse(res, 'MISSING_TITLE', 'Bhai meeting ka title dena zaroori hai', 400);
        }

        const meeting = await meetingService.createMeeting(hostId, title);
        return successResponse(res, meeting, 201);
    } catch (error) {
        next(error);
    }
};

const validateRoom = async (req, res, next) => {
    try {
        const { roomCode } = req.params; 
        const meeting = await meetingService.getMeetingByCode(roomCode);
        
        if (!meeting) {
            return errorResponse(res, 'ROOM_NOT_FOUND', 'Ye room code galat hai ya meeting exist nhi krti', 404);
        }

        return successResponse(res, meeting, 200);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createInstantMeeting,
    createScheduledMeeting,
    validateRoom
};
