const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing users
    const existingAdmin = await User.findOne({ email: 'aminullshaik18@gmail.com' });
    if (existingAdmin) {
        console.log('Admin already exists');
        process.exit();
    }

    // Create Admin
    const admin = await User.create({
        name: 'Admin User',
        email: 'aminullshaik18@gmail.com',
        password: 'Ameen@7862',
        role: 'admin'
    });

    console.log('Admin User Created:', admin.email);
    console.log('Password: Ameen@7862');
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
