const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config(); // Loads .env from current directory

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Delete existing admin
        await User.deleteMany({ email: 'aminullshaik18@gmail.com' });
        console.log('Removed existing admin user.');

        // Create new admin
        const admin = await User.create({
            name: 'Aminulla Shaik',
            email: 'aminullshaik18@gmail.com',
            password: 'Ameen@7862',
            role: 'admin'
        });

        console.log('Admin User Re-Created Successfully');
        console.log('Final Email: aminullshaik18@gmail.com');
        console.log('Final Password: Ameen@7862');
        
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

resetAdmin();
