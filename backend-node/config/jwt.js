require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'InvestigacionUDSecretKey2024ForJWTTokenGenerationAndValidation',
  expiration: process.env.JWT_EXPIRATION || 86400000, // 24 hours in milliseconds
};

