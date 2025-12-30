const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('./models/Bus');

dotenv.config();

const buses = [
  {
    busNumber: 'KA-01-F-1234',
    operatorName: 'Sharma Travels',
    type: 'AC',
    totalSeats: 20,
    layout: [] // default
  },
  {
    busNumber: 'TN-09-X-9876',
    operatorName: 'Orange Travels',
    type: 'Sleeper',
    totalSeats: 15,
    layout: []
  },
  {
    busNumber: 'AP-21-Z-5555',
    operatorName: 'Morning Star',
    type: 'Non-AC',
    totalSeats: 30,
    layout: []
  }
];

const seedBuses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Create buses
    for (const busData of buses) {
        const busExists = await Bus.findOne({ busNumber: busData.busNumber });
        if (!busExists) {
            await Bus.create(busData);
            console.log(`Added bus: ${busData.busNumber}`);
        } else {
            console.log(`Bus already exists: ${busData.busNumber}`);
        }
    }

    console.log('Bus seeding completed.');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedBuses();
