const express = require('express');
const router = express.Router();
const meetingController = require('./meeting.controller');
const authMiddleware = require('../../middleware/auth'); 

// Instant meeting create krne ka rasta
// (authMiddleware bouncer ki tarah check krega ki user logged in hai ya nhi)
router.post('/instant', authMiddleware, meetingController.createInstantMeeting);

// Scheduled meeting create krne ka rasta (jisme title dena hoga)
router.post('/create', authMiddleware, meetingController.createScheduledMeeting);


//User ki purani meetings dekhne ka rasta
router.get('/my', authMiddleware, meetingController.getMyMeetings);


// Check krne ke liye ki room exist krta hai ya nhi
// (Yaha authMiddleware nhi lagaya kyuki guests bhi room check kr skte hai bina login kiye!)
router.get('/:roomCode/validate', meetingController.validateRoom);

module.exports = router;
