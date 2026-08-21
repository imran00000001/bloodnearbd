const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../atlas-credentials.env') });

const getConnectionString = () => {
    if (process.env.MONGODB_URI) {
        return process.env.MONGODB_URI;
    }

    if (process.env.DB_SECRET) {
        let connectionURI = process.env.DB_SECRET;
        connectionURI = connectionURI.replace('<username>', process.env.DB_USER || process.env.MONGODB_USERNAME || '');
        connectionURI = connectionURI.replace('<password>', process.env.DB_PASS || process.env.MONGODB_PASSWORD || '');
        connectionURI = connectionURI.replace('<db_password>', process.env.DB_PASS || process.env.MONGODB_PASSWORD || '');
        return connectionURI;
    }

    if (process.env.DATABASE_PROD) {
        return process.env.DATABASE_PROD;
    }

    throw new Error('No MongoDB connection string is configured.');
};

const connectDB = async () => {
    const uri = getConnectionString();

    await mongoose.connect(uri, { dbName: process.env.DB_NAME || 'BloodDB' });
    console.log('Connected to database');
};

module.exports = connectDB;