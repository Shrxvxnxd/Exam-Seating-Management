const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const SystemEvent = sequelize.define('SystemEvent', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.STRING,
        validate: {
            isIn: [['maintenance', 'incident', 'info']]
        },
        allowNull: false,
        defaultValue: 'info'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING, // e.g., "Scheduled", "In Progress", "Resolved"
        allowNull: true
    },
    scheduled_start: {
        type: DataTypes.DATE,
        allowNull: true
    },
    scheduled_end: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'system_events',
    timestamps: true
});

module.exports = SystemEvent;
