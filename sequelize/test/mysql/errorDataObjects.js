/**
 * unsupported sample data objects
 *
 */
import {DataTypes} from '../../mysql/mysql.js';

export const caseSensitive = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	ID: DataTypes.STRING
};
