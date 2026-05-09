const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const Schedule = require('../models/Schedule');

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected. Clearing old data...');

        // Clear existing data
        await User.deleteMany({});
        await Bus.deleteMany({});
        await Route.deleteMany({});
        await Schedule.deleteMany({});

        // 1. Create Admin User
        const admin = await User.create({
            name: 'Elite Admin',
            email: 'aminullashaik18@gmail.com',
            password: 'Ameen@7862',
            secretPin: '1234', // Default recovery pin
            role: 'admin'
        });
        console.log('✅ Admin Created [aminullashaik18@gmail.com / Ameen@7862]');

        // 2. Create Sample User
        await User.create({
            name: 'John Doe',
            email: 'john@gmail.com',
            password: 'password123',
            role: 'user'
        });
        console.log('✅ Demo User Created [john@gmail.com / password123]');

        // 3. Create Buses
        const buses = await Bus.create([
            {
                busNumber: 'KA-01-EL-7777',
                operatorName: 'JBS Executive',
                type: 'AC Sleeper',
                totalSeats: 30
            },
            {
                busNumber: 'MH-12-PR-9999',
                operatorName: 'Elite Travels',
                type: 'AC Seater',
                totalSeats: 40
            },
            {
                busNumber: 'TS-09-UB-1234',
                operatorName: 'Royal Express',
                type: 'Non-AC Sleeper',
                totalSeats: 32
            }
        ]);
        console.log('✅ Buses Created');

        // 4. Create Routes
        const routes = await Route.create([
            { source: 'Bangalore', destination: 'Hyderabad', departurePoint: 'Majestic Stand', arrivalPoint: 'MGBS Terminal', distance: 570, duration: '9h' },
            { source: 'Mumbai', destination: 'Pune', departurePoint: 'Dadar East', arrivalPoint: 'Swargate', distance: 150, duration: '3h' },
            { source: 'Hyderabad', destination: 'Bangalore', departurePoint: 'MGBS Terminal', arrivalPoint: 'Majestic Stand', distance: 570, duration: '9h' }
        ]);
        console.log('✅ Routes Created');

        // 5. Create Schedules (Today and Tomorrow)
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const schedules = [];
        
        // Bangalore to Hyderabad Today Night
        const s1_dep = new Date(today);
        s1_dep.setHours(21, 0, 0);
        const s1_arr = new Date(today);
        s1_arr.setHours(21 + 9, 30, 0);

        schedules.push({
            bus: buses[0]._id,
            route: routes[0]._id,
            departureTime: s1_dep,
            arrivalTime: s1_arr,
            price: 1250,
            bookedSeats: ['1A', '1B']
        });

        // Mumbai to Pune Today Afternoon
        const s2_dep = new Date(today);
        s2_dep.setHours(14, 0, 0);
        const s2_arr = new Date(today);
        s2_arr.setHours(17, 0, 0);

        schedules.push({
            bus: buses[1]._id,
            route: routes[1]._id,
            departureTime: s2_dep,
            arrivalTime: s2_arr,
            price: 450,
            bookedSeats: []
        });

        // Bangalore to Hyderabad Tomorrow Night
        const s3_dep = new Date(tomorrow);
        s3_dep.setHours(22, 0, 0);
        const s3_arr = new Date(tomorrow);
        s3_arr.setHours(22 + 9, 0, 0);

        schedules.push({
            bus: buses[0]._id,
            route: routes[0]._id,
            departureTime: s3_dep,
            arrivalTime: s3_arr,
            price: 1400,
            bookedSeats: []
        });

        await Schedule.insertMany(schedules);
        console.log('✅ Schedules Created');

        console.log('--- SEEDING COMPLETE ---');
        process.exit();
    } catch (error) {
        console.error('SEED ERROR:', error);
        process.exit(1);
    }
};

seedData();
