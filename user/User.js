const { DataTypes } = require('sequelize');
const connection = require('../database/database');

const User = connection.define('users', {
	email: {
		type: DataTypes.STRING,
		allowNull: false
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	verifiemail: {
		type: DataTypes.STRING,
		}
})
module.exports = User;