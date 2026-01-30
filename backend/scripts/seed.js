const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from one level up if running from scripts folder context, 
// or current directory if running from backend root.
// Safest is to explicitly point to the backend root .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Bus = require('../models/Bus');
const Route = require('../models/Route');

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB at:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Create Admin User
    // Check if exists first
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (!existingAdmin) {
        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'adminpassword', 
            role: 'admin'
        });
        console.log('Admin User Created');
    } else {
        console.log('Admin User already exists');
    }

    process.exit();
  } catch (error) {
    console.error('SEED ERROR:', error);
    process.exit(1);
  }
};

seedData();
