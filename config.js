const fs = require('fs');
require('dotenv').config();

module.exports = {
    SESSION_ID: process.env.SESSION_ID || "",
    MONGODB: process.env.MONGODB || "enter mongodb here",
};
