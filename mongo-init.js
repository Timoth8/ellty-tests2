// MongoDB initialization script
db = db.getSiblingDB('ellty-comments');

// Create collections
db.createCollection('users');
db.createCollection('comments');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.comments.createIndex({ userId: 1 });
db.comments.createIndex({ parentId: 1 });
db.comments.createIndex({ createdAt: -1 });

print('Database initialized successfully');
