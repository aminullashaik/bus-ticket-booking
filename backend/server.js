const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Schedule = require('./models/Schedule');


dotenv.config({ path: path.join(__dirname, '.env') });
connectDB();

const app = express();
const server = http.createServer(app);

// Environment Variable Validation
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('FATAL ERROR: MONGO_URI or JWT_SECRET is not defined.');
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: '*', // Allow all origins in production for stability
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/buses', require('./routes/busRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));
app.use('/api/schedules', require('./routes/scheduleRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));

// Root Route
app.get('/', (req, res) => {
  res.send('Bus Booking API is running...');
});

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Real-time tracking simulation
const trackBus = (pnr) => {
    // Bangalore to Mysore mock route
    const routePoints = [
        { lat: 12.9716, lng: 77.5946, name: 'Bangalore (Majestic)' },
        { lat: 12.9249, lng: 77.4991, name: 'Kengeri' },
        { lat: 12.7150, lng: 77.2813, name: 'Ramanagara' },
        { lat: 12.6560, lng: 77.2000, name: 'Channapatna' },
        { lat: 12.5222, lng: 77.0459, name: 'Mandya' },
        { lat: 12.3833, lng: 76.8667, name: 'Srirangapatna' },
        { lat: 12.2958, lng: 76.6394, name: 'Mysore (Suburban)' }
    ];

    let currentIndex = 0;
    let step = 0;
    const stepsPerSegment = 20;

    const interval = setInterval(() => {
        if (currentIndex >= routePoints.length - 1) {
            // Reached destination, reset or stop
            currentIndex = 0;
            step = 0;
        }

        const start = routePoints[currentIndex];
        const end = routePoints[currentIndex + 1];

        // Interpolate position
        const lat = start.lat + (end.lat - start.lat) * (step / stepsPerSegment);
        const lng = start.lng + (end.lng - start.lng) * (step / stepsPerSegment);
        
        // Calculate ETA (Mock: 5 mins per segment, remaining steps)
        const remainingSegments = (routePoints.length - 1 - currentIndex);
        const remainingStepsInCurrent = stepsPerSegment - step;
        const totalRemainingSteps = (remainingSegments - 1) * stepsPerSegment + remainingStepsInCurrent;
        const etaMinutes = Math.floor(totalRemainingSteps * 0.5); // 30 seconds per step = 0.5 min

        const speed = Math.floor(55 + Math.random() * 15) + " km/h";
        const locationName = step < stepsPerSegment / 2 ? start.name : end.name;

        io.to(pnr).emit('bus_location', {
            lat,
            lng,
            speed,
            locationName,
            eta: etaMinutes,
            nextStop: end.name,
            lastUpdate: new Date().toLocaleTimeString(),
            isArriving: etaMinutes <= 15
        });

        step++;
        if (step > stepsPerSegment) {
            step = 0;
            currentIndex++;
        }
    }, 2000); // Update every 2 seconds

    return interval;
};

const activeTracking = new Map();

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_bus', (pnr) => {
        socket.join(pnr);
        console.log(`Client ${socket.id} joined tracking for PNR ${pnr}`);
        
        // Start simulation for this PNR if not already running
        if (!activeTracking.has(pnr)) {
            console.log(`Starting tracking for PNR ${pnr}`);
            const intervalId = trackBus(pnr);
            activeTracking.set(pnr, intervalId);
        }
    });

    socket.on('leave_bus', (pnr) => {
        socket.leave(pnr);
        console.log(`Client ${socket.id} left tracking for PNR ${pnr}`);
        
        // If no more clients in this room, stop tracking
        const room = io.sockets.adapter.rooms.get(pnr);
        if (!room || room.size === 0) {
            if (activeTracking.has(pnr)) {
                clearInterval(activeTracking.get(pnr));
                activeTracking.delete(pnr);
                console.log(`Stopped tracking for PNR ${pnr} (No observers left)`);
            }
        }
    });

    socket.on('reset_tracking', (pnr) => {
        if (activeTracking.has(pnr)) {
            clearInterval(activeTracking.get(pnr));
            const intervalId = trackBus(pnr);
            activeTracking.set(pnr, intervalId);
            console.log(`Reset tracking for PNR ${pnr}`);
        }
    });

    socket.on('disconnecting', () => {
        // Stop tracking for any rooms that will become empty
        for (const roomName of socket.rooms) {
            if (activeTracking.has(roomName)) {
                const room = io.sockets.adapter.rooms.get(roomName);
                if (room && room.size === 1) { // Current socket is the last one
                    clearInterval(activeTracking.get(roomName));
                    activeTracking.delete(roomName);
                    console.log(`Stopped tracking for PNR ${roomName} on disconnect`);
                }
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Global Error Handling to prevent silent crashes
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // You might want to log this to a file or monitoring service
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
    // Give time for logs to write before exiting
    setTimeout(() => {
        process.exit(1);
    }, 1000);
});

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
