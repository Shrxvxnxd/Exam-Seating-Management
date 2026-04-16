const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Faculty = require('./Faculty');

const Attendance = sequelize.define('Attendance', {
    faculty_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Faculty,
            key: 'id'
        },
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    student_reg: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Present', 'Absent', 'Late'),
        defaultValue: 'Present'
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Optional: Store which assignment this attendance is linked to
    assignment_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    period: {
        type: DataTypes.STRING,
        allowNull: true
    },
    remarks: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'Attendance',
    indexes: [
        {
            fields: ['date', 'student_reg', 'subject', 'period'],
            // Composite index to prevent duplicates for same student, same subject, same day
            // But 'subject' might be null.
        }
    ]
});

module.exports = Attendance;
