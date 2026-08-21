// Run this once (node seed.js) AFTER npm install and setting up your .env file
// It fills the "districts" and "upuzilas" collections in MongoDB from the local json files.

const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, 'atlas-credentials.env') });

const mongoose = require('mongoose');
const fs = require('fs');
const districts = require('./src/models/Districts');
const upuzilas = require('./src/models/Upuzila');

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

  throw new Error('No MongoDB connection string is configured.');
};

async function seed() {
  const uri = getConnectionString();
  await mongoose.connect(uri, { dbName: process.env.DB_NAME || 'BloodDB' });
  console.log('Connected to database for seeding...');

  const districtsData = JSON.parse(fs.readFileSync('./districts.json', 'utf-8')).map((d) => ({
    districtId: d.district_id,
    name: d.name,
    bn_name: d.bn_name,
    lat: d.lat,
    lon: d.lon,
    url: d.url,
  }));

  const upazilasData = JSON.parse(fs.readFileSync('./upazilas.json', 'utf-8')).map((u) => ({
    district_id: u.district_id,
    name: u.name,
    bn_name: u.bn_name,
    lat: u.lat || '',
    lon: u.lon || '',
    url: u.url,
  }));

  await districts.deleteMany({});
  await upuzilas.deleteMany({});

  await districts.insertMany(districtsData);
  await upuzilas.insertMany(upazilasData);

  console.log(`Inserted ${districtsData.length} districts and ${upazilasData.length} upazilas.`);
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
