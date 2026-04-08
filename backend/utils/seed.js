const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Grade = require('../models/Grade');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/school_management')
  .then(async () => {
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Class.deleteMany({});
    await Subject.deleteMany({});
    await Grade.deleteMany({});

    // Create grades
    const grade1 = await Grade.create({ name: 'Grade 1', level: 1 });
    const grade10 = await Grade.create({ name: 'Grade 10', level: 10 });

    // Create admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      email: 'admin@school.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      isActive: true,
      isVerified: true
    });

    // Create teacher
    const hashedTeacherPass = await bcrypt.hash('teacher123', 10);
    const teacher = await User.create({
      username: 'teacher1',
      email: 'teacher@school.com',
      password: hashedTeacherPass,
      name: 'John Teacher',
      role: 'teacher',
      isActive: true,
      isVerified: true
    });

    // Create class
    const class10A = await Class.create({
      name: 'Grade 10 A',
      grade: grade10._id,
      section: 'A',
      academicYear: '2024-2025',
      classTeacher: teacher._id,
      capacity: 30,
      isActive: true
    });

    console.log('✅ Seeded:');
    console.log('- Admin: admin@school.com / admin123');
    console.log('- Teacher: teacher@school.com / teacher123');
    console.log('- Class 10A with teacher');
    console.log('Disconnecting...');
    mongoose.disconnect();
  })
  .catch(err => console.error('Seed error:', err));
