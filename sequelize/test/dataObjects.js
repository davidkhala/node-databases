/**
 * Sample data objects
 */
const {DataTypes} = require('../Mysql');
exports.User = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false
	},
	Name: DataTypes.STRING, // default is `mysql:varchar(255)`
	Name_en: DataTypes.STRING(400),
	Detail: DataTypes.JSON,
	Fee: DataTypes.FLOAT,
	Role: DataTypes.ENUM('client', 'admin'),
	Status: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	Time: DataTypes.TIME, // TIME values in 'hh:mm:ss' format
	Date: DataTypes.DATE, // The mysql:DATETIME type in 'YYYY-MM-DD hh:mm:ss' format.
	TIMESTAMP: DataTypes.TIMESTAMP,
	counter: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	remark: DataTypes.TEXT

};
