const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Admin = sequelize.define('Admin', {
    employee_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        validate: {
            isIn: [['main_admin', 'sub_admin', 'view_only']]
        },
        defaultValue: 'sub_admin'
    },
    permissions: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    mfa_secret: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_mfa_setup: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    backup_codes: {
        type: DataTypes.JSON,
        defaultValue: []
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['username'],
            name: 'admin_username_unique'
        },
        {
            unique: true,
            fields: ['employee_id'],
            name: 'admin_employee_id_unique'
        }
    ]
});

module.exports = Admin;
