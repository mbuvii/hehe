const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "hu00WI7L#ehUvwi2sq_iBNGUdSpYoqfN15LxonFX1ZpHqAvaL_S8",
MONGODB: process.env.MONGODB || "mongodb+srv://cheekyheroku:elisa1@elisa.sqrwy.mongodb.net/",
};
