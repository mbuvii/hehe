const fs = require('fs');
require('dotenv').config();

module.exports = {
    SESSION_ID: process.env.SESSION_ID || "",
    MONGODB: process.env.MONGODB || "mongodb+srv://cheekyheroku:elisa1@elisa.sqrwy.mongodb.net/",
};
