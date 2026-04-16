const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Faculty = require('./Faculty');

const FacultyAssignment = sequelize.define('FacultyAssignment', {
    // This model links a Faculty member to a specific "Class" or "Batch" of students
    faculty_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Faculty,
            key: 'id'
        },
        allowNull: false
    },
    // Batch Details
    branch: {
        type: DataTypes.STRING,
        allowNull: false
    },
    section: {
        type: DataTypes.STRING, // e.g., "A", "B", or "All"
        allowNull: true
    },
    year: {
        type: DataTypes.STRING, // e.g., "3", "3rd Year"
        allowNull: false
    },
    // Optional: Subject context
    subject: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Student Range Definition
    start_reg: {
        type: DataTypes.STRING,
        allowNull: true
    },
    end_reg: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Exclusions
    excluded_reg: {
        type: DataTypes.JSON, // Array of Reg Numbers to exclude
        defaultValue: []
    },
    // New Fields
    period: {
        type: DataTypes.STRING,
        allowNull: true
    },
    room_no: {
        type: DataTypes.STRING,
        allowNull: true
    },
    day_of_week: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'FacultyAssignments'
});

Faculty.hasMany(FacultyAssignment, { foreignKey: 'faculty_id' });
FacultyAssignment.belongsTo(Faculty, { foreignKey: 'faculty_id' });

module.exports = FacultyAssignment;
