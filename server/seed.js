const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Comment = require('./models/Comment');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Comment.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users with authentication credentials
    const alex = await User.create({
      name: 'Alex',
      email: 'alex@example.com',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/60?img=1'
    });

    const george = await User.create({
      name: 'George',
      email: 'george@example.com',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/60?img=2'
    });

    const masha = await User.create({
      name: 'Masha',
      email: 'masha@example.com',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/60?img=5'
    });

    const syed = await User.create({
      name: 'Syed',
      email: 'syed@example.com',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/60?img=3'
    });

    const julia = await User.create({
      name: 'Julia',
      email: 'julia@example.com',
      password: 'password123',
      avatar: 'https://i.pravatar.cc/60?img=4'
    });

    console.log('👥 Created users');

    // Create comments with proper dates matching the screenshot
    const alexComment = await Comment.create({
      userId: alex._id,
      content: 'Fusce nec accumsan eros. Aenean ac orci a magna vestibulum posuere quis nec nisi. Maecenas rutrum vehicula Fusce nec accumsan eros. Aenean ac orci a magna vestibulum posuere quis nec nisi. Maecenas rutrum vehicula condimentum. Donec volutpat nisi ac mauris consectetur gravida. Donec ipsum dolor sit amet, consectetur adipiscing elit. Donec vel vulputate nish. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
      parentId: null,
      createdAt: new Date('2017-07-10T09:00:00')
    });

    const georgeComment = await Comment.create({
      userId: george._id,
      content: 'Text2',
      parentId: alexComment._id,
      createdAt: new Date('2017-07-10T11:06:00')
    });

    const mashaComment = await Comment.create({
      userId: masha._id,
      content: 'Text3',
      parentId: georgeComment._id,
      createdAt: new Date('2017-07-11T05:20:00')
    });

    const syedComment = await Comment.create({
      userId: syed._id,
      content: 'Text5',
      parentId: mashaComment._id,
      createdAt: new Date('2017-07-12T06:15:00')
    });

    const juliaComment = await Comment.create({
      userId: julia._id,
      content: 'Text4',
      parentId: null,
      createdAt: new Date('2017-07-11T16:28:00')
    });

    console.log('💬 Created comments with nested structure');
    console.log('✅ Seed data inserted successfully!');
    console.log('\n📧 Test Login Credentials:');
    console.log('   Email: alex@example.com | Password: password123');
    console.log('   Email: george@example.com | Password: password123');
    console.log('   Email: masha@example.com | Password: password123');
    console.log('   Email: syed@example.com | Password: password123');
    console.log('   Email: julia@example.com | Password: password123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
