/**
 * unsupported sample data objects
 *
 */
const {DataTypes} = require('../Mysql');
exports.caseSensitive = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	ID: DataTypes.STRING
};
