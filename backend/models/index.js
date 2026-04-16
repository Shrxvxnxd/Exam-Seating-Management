const Exam = require('./Exam');
const Seating = require('./Seating');
const Admin = require('./Admin');
const Student = require('./Student');
const Malpractice = require('./Malpractice');
const SystemEvent = require('./SystemEvent');
const Faculty = require('./Faculty');
const FacultyAssignment = require('./FacultyAssignment');
const Attendance = require('./Attendance');
const { sequelize } = require('../db');

// Associations
Attendance.belongsTo(FacultyAssignment, { foreignKey: 'assignment_id' });
FacultyAssignment.hasMany(Attendance, { foreignKey: 'assignment_id' });

const syncDB = async () => {
    try {
        await sequelize.sync({ alter: false }); // Disabled to prevent production sync errors

    } catch (error) {
        console.error('Database sync failed:', error);
    }
};

module.exports = { Exam, Seating, Admin, Student, Malpractice, SystemEvent, Faculty, FacultyAssignment, Attendance, syncDB, sequelize };
