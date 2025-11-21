const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in .env file');
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function testLogin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const user = await User.findOne({ name: 'Admin User' });
    if (!user) {
      console.log('User "Admin User" not found!');
      process.exit(1);
    }

    console.log('Found user:');
    console.log('  Name:', user.name);
    console.log('  Email:', user.email);
    console.log('  Password hash:', user.password.substring(0, 20) + '...');
    console.log('\nTesting password "admin123":');

    const isValid = await bcrypt.compare('admin123', user.password);
    console.log('Password valid:', isValid);

    if (!isValid) {
      console.log('\n⚠️  Password does not match!');
      console.log('Creating new hash for "admin123"...');
      const newHash = await bcrypt.hash('admin123', 10);
      await User.updateOne({ _id: user._id }, { password: newHash });
      console.log('✅ Password updated in database');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testLogin();

