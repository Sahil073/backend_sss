const express = require('express')
const cors = require('cors')
const {CLIENT_URL} = require('./config/env')
const errorHandler = require('./middleware/errorHandler')


const app = express()

app.use(cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true
}))

app.use(express.json())

// This is the place for the routes Sweety, I am adding one route of the auth, rest you may add or let me know
app.use('/api/auth', require('./modules/auth/auth.routes'))

const meetingRoutes = require('./modules/meeting/meeting.routes');
app.use('/api/meetings', meetingRoutes);

app.use(errorHandler)
module.exports = app 