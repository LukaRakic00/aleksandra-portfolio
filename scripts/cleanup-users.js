const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in .env file');
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function cleanupUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const allUsers = await User.find({});
    console.log(`Found ${allUsers.length} users in database`);

    if (allUsers.length === 0) {
      console.log('No users found in database');
      process.exit(0);
    }

    // Keep the first user (usually admin)
    const userToKeep = allUsers[0];
    console.log(`Keeping user: ${userToKeep.email} (${userToKeep.name})`);

    // Delete all other users
    const result = await User.deleteMany({ _id: { $ne: userToKeep._id } });
    console.log(`Deleted ${result.deletedCount} users`);

    // Verify
    const remainingUsers = await User.find({});
    console.log(`Remaining users: ${remainingUsers.length}`);
    remainingUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.name})`);
    });

    console.log('\n✅ User cleanup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning up users:', error);
    process.exit(1);
  }
}

cleanupUsers();

