/**
 * unsupported sample data objects
 *
 */
import {DataTypes} from '../../mysql/index.js';

export const caseSensitive = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	ID: DataTypes.STRING
};
