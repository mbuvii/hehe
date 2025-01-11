// lib/mongodb.js
const mongoose = require('mongoose'); 
const config = require('../config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('🛜 MongoDB Connected ✅');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
