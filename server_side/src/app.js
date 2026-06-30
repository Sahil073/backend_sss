const express = require('express')
const cors = require('cors')
const {CLIENT_URL} = require('./config/env')
const errorHandler = require('./middleware/errorHandler')


const app = express()

const allowedOrigins = [
    "http://localhost:5173", 
    CLIENT_URL               
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no Origin header
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true
}));

app.use(express.json())

// adding one health route for uptime bot
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "backend-sss",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
// This is the place for the routes Sweety, I am adding one route of the auth, rest you may add or let me know
app.use('/api/auth', require('./modules/auth/auth.routes'))


const meetingRoutes = require('./modules/meeting/meeting.routes');
app.use('/api/meetings', meetingRoutes);

app.use(errorHandler)
module.exports = app 