const meetingModel = require('./meeting.model');
const generateRoomCode = require('../../utils/generateRoomCode');

const formatMeetingResponse = (meeting) => {
    return {
        meetingId: meeting.id,
        roomCode: meeting.room_code,
        title: meeting.title,
        hostId: meeting.host_id,
        status: meeting.status
    };
};

const createMeeting = async (hostId, title) => {
    const roomCode = await generateRoomCode();
    const newMeeting = await meetingModel.createMeeting(hostId, title, roomCode);
    
    return formatMeetingResponse(newMeeting);
};

const getMeetingByCode = async (roomCode) => {
    const meeting = await meetingModel.getMeetingByCode(roomCode);
    if (meeting) {
        return formatMeetingResponse(meeting);
    }
    return null;
};

const getPastMeetings = async (hostId) => {
    const meetings = await meetingModel.getMeetingsByHostId(hostId);
    return meetings.map(meeting => formatMeetingResponse(meeting));
}



module.exports = {
    createMeeting,
    getMeetingByCode,
    getPastMeetings
};
