require('dotenv').config();

module.exports = {
  SESSION_ID: process.env.SESSION_ID,
  MONGODB: process.env.MONGODB,
  PORT: process.env.PORT || 8000,
};
