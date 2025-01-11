// config.js
require('dotenv').config(); // Ensure dotenv is loaded first

module.exports = {
    SESSION_ID: process.env.SESSION_ID,
    MONGODB: process.env.MONGODB || "mongodb+srv://cheekyheroku:elisa1@elisa.sqrwy.mongodb.net/", // Ensure you have a default value here if needed
};
