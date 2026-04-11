const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Grade = require('../models/Grade');
const Assignment = require('../models/Assignment');
const Announcement = require('../models/Announcement');
const Event = require('../models/Event');
const Exam = require('../models/Exam');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/school_management')
  .then(async () => {
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Class.deleteMany({});
    await Subject.deleteMany({});
    await Grade.deleteMany({});
    await Assignment.deleteMany({});
    await Announcement.deleteMany({});
    await Event.deleteMany({});
    await Exam.deleteMany({});

    // Create grades (1-12)
    const grades = [];
    for (let i = 1; i <= 12; i++) {
      const grade = await Grade.create({ 
        name: `Grade ${i}`, 
        level: i,
        subjects: [] // Will populate later
      });
      grades.push(grade);
    }

    // Create subjects
    const subjects = await Subject.insertMany([
      { name: 'Mathematics', code: 'MATH', description: 'Advanced Mathematics', credits: 4, department: 'Science' },
      { name: 'English', code: 'ENG', description: 'English Literature and Language', credits: 3, department: 'Languages' },
      { name: 'Science', code: 'SCI', description: 'General Science', credits: 4, department: 'Science' },
      { name: 'History', code: 'HIST', description: 'World History', credits: 3, department: 'Social Studies' },
      { name: 'Geography', code: 'GEO', description: 'Geography and Environment', credits: 3, department: 'Social Studies' },
      { name: 'Computer Science', code: 'CS', description: 'Programming and Technology', credits: 4, department: 'Technology' },
      { name: 'Physical Education', code: 'PE', description: 'Sports and Fitness', credits: 2, department: 'Physical Education' },
      { name: 'Art', code: 'ART', description: 'Visual Arts', credits: 2, department: 'Arts' }
    ]);

    // Assign subjects to grades
    for (let grade of grades) {
      grade.subjects = subjects.map(s => s._id);
      await grade.save();
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      email: 'admin@school.com',
      password: hashedPassword,
      name: 'School Administrator',
      role: 'admin',
      isActive: true,
      isVerified: true
    });

    // Create teachers
    const teachers = [];
    const teacherData = [
      { name: 'John Smith', email: 'john@school.com', subjects: ['MATH', 'SCI'] },
      { name: 'Sarah Johnson', email: 'sarah@school.com', subjects: ['ENG', 'HIST'] },
      { name: 'Mike Davis', email: 'mike@school.com', subjects: ['CS', 'GEO'] },
      { name: 'Emma Wilson', email: 'emma@school.com', subjects: ['ART', 'PE'] }
    ];

    for (let data of teacherData) {
      const hashedPass = await bcrypt.hash('teacher123', 10);
      const teacher = await User.create({
        username: data.email.split('@')[0],
        email: data.email,
        password: hashedPass,
        name: data.name,
        role: 'teacher',
        subjects: subjects.filter(s => data.subjects.includes(s.code)).map(s => s._id),
        isActive: true,
        isVerified: true
      });
      teachers.push(teacher);
    }

    // Create classes
    const classes = [];
    const classData = [
      { name: 'Grade 10 A', grade: grades[9], teacher: teachers[0] },
      { name: 'Grade 10 B', grade: grades[9], teacher: teachers[1] },
      { name: 'Grade 11 A', grade: grades[10], teacher: teachers[2] },
      { name: 'Grade 9 A', grade: grades[8], teacher: teachers[3] }
    ];

    for (let data of classData) {
      const cls = await Class.create({
        name: data.name,
        grade: data.grade._id,
        section: data.name.split(' ')[1],
        academicYear: '2024-2025',
        classTeacher: data.teacher._id,
        subjects: subjects.map(s => ({ subject: s._id, teacher: data.teacher._id })),
        capacity: 30,
        isActive: true
      });
      classes.push(cls);
    }

    // Create parents
    const parents = [];
    const parentData = [
      { name: 'Robert Johnson', email: 'robert@email.com' },
      { name: 'Mary Davis', email: 'mary@email.com' },
      { name: 'David Wilson', email: 'david@email.com' },
      { name: 'Lisa Brown', email: 'lisa@email.com' }
    ];

    for (let data of parentData) {
      const hashedPass = await bcrypt.hash('parent123', 10);
      const parent = await User.create({
        username: data.email.split('@')[0],
        email: data.email,
        password: hashedPass,
        name: data.name,
        role: 'parent',
        isActive: true,
        isVerified: true
      });
      parents.push(parent);
    }

    // Create students
    const students = [];
    const studentData = [
      { name: 'Emma Johnson', email: 'emma@student.com', class: classes[0], parent: parents[0] },
      { name: 'Liam Johnson', email: 'liam@student.com', class: classes[1], parent: parents[0] },
      { name: 'Sophia Davis', email: 'sophia@student.com', class: classes[0], parent: parents[1] },
      { name: 'Noah Wilson', email: 'noah@student.com', class: classes[2], parent: parents[2] },
      { name: 'Olivia Brown', email: 'olivia@student.com', class: classes[3], parent: parents[3] },
      { name: 'Jackson Smith', email: 'jackson@student.com', class: classes[1], parent: parents[1] }
    ];

    for (let data of studentData) {
      const hashedPass = await bcrypt.hash('student123', 10);
      const student = await User.create({
        username: data.email.split('@')[0],
        email: data.email,
        password: hashedPass,
        name: data.name,
        role: 'student',
        class: data.class._id,
        grade: data.class.grade,
        subjects: subjects.map(s => s._id),
        parent: data.parent._id,
        isActive: true,
        isVerified: true
      });
      students.push(student);
    }

    // Update classes with students
    for (let cls of classes) {
      cls.students = students.filter(s => s.class.toString() === cls._id.toString()).map(s => s._id);
      await cls.save();
    }

    // Create sample assignments
    const assignments = [];
    for (let i = 0; i < 5; i++) {
      const assignment = await Assignment.create({
        title: `Assignment ${i + 1}: ${subjects[i % subjects.length].name} Exercise`,
        description: `Complete exercises 1-${i + 10} from chapter ${i + 1}`,
        class: classes[i % classes.length]._id,
        subject: subjects[i % subjects.length]._id,
        teacher: teachers[i % teachers.length]._id,
        dueDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000), // 1-5 weeks from now
        totalPoints: 100,
        attachments: [],
        submissions: []
      });
      assignments.push(assignment);
    }

    // Create sample announcement
    await Announcement.create({
      title: 'Welcome to School Management System',
      content: 'We are excited to have you join our digital learning platform. Please check your assignments regularly.',
      createdBy: admin._id,
      targetAudience: 'all',
      priority: 'normal',
      status: 'published',
      publishDate: new Date(),
      isActive: true
    });

    // Create sample event
    await Event.create({
      title: 'Parent-Teacher Meeting',
      description: 'Annual parent-teacher conference to discuss student progress',
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
      startTime: '14:00',
      endTime: '16:00',
      location: 'School Auditorium',
      targetAudience: 'all',
      color: '#3b82f6',
      createdBy: admin._id
    });

    console.log('✅ Seeded successfully!');
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log('Admin: admin@school.com / admin123');
    console.log('Teachers: teacher@school.com, sarah@school.com, mike@school.com, emma@school.com / teacher123');
    console.log('Parents: robert@email.com, mary@email.com, david@email.com, lisa@email.com / parent123');
    console.log('Students: emma@student.com, liam@student.com, sophia@student.com, noah@student.com, olivia@student.com, jackson@student.com / student123');
    console.log('\n📊 DATA CREATED:');
    console.log(`- ${grades.length} grades`);
    console.log(`- ${subjects.length} subjects`);
    console.log(`- ${teachers.length} teachers`);
    console.log(`- ${classes.length} classes`);
    console.log(`- ${parents.length} parents`);
    console.log(`- ${students.length} students`);
    console.log(`- ${assignments.length} assignments`);
    console.log('- 1 announcement');
    console.log('- 1 event');
    
    console.log('\nDisconnecting...');
    mongoose.disconnect();
  })
  .catch(err => console.error('Seed error:', err));
