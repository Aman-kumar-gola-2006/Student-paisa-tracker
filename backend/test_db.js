const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGO_URI ? 'Defined' : 'Undefined');

const connectDB = async () => {
    try {
        console.log('Attempting to connect...');
        // Set a short timeout to fail fast
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 5000
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error(`Name: ${error.name}`);
        if (error.reason) console.error(`Reason: ${JSON.stringify(error.reason)}`);
        process.exit(1);
    }
};

connectDB();
