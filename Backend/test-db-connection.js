import mongoose from 'mongoose';
import fs from 'fs';

console.log('Testing MongoDB connection...');

console.log('Current Directory:', process.cwd());
console.log('Environment keys (from process.env):', Object.keys(process.env).filter(k => k.includes('MONGO')));

if (fs.existsSync('.env')) {
    console.log('.env file found.');
    const envContent = fs.readFileSync('.env', 'utf8');
    const lines = envContent.split('\n');
    console.log('Keys found in .env file:');
    lines.forEach(line => {
      const match = line.match(/^([^=]+)=/);
      if (match) console.log(match[1]);
    });
} else {
    console.log('.env file NOT found.');
}

if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env');
  process.exit(1);
}

console.log('MONGODB_URI loaded. Attempting to connect...');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log(`Host: ${mongoose.connection.host}`);
    console.log(`Database Name: ${mongoose.connection.name}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
