import Sequelize from 'sequelize';

/**
 * @enum
 */
export const DefaultDatabase = {
	mysql: 'mysql',
	info: 'information_schema'
};

const {DataTypes, Op} = Sequelize;
const MySQLDataTypes = Object.assign({TIMESTAMP: 'TIMESTAMP'}, DataTypes);// no any match for mysql dataType:TIMESTAMP
export {MySQLDataTypes as DataTypes, Op};


const dataTypes = {
	string: DataTypes.STRING,
	object: DataTypes.JSON,
	number: DataTypes.FLOAT,
	boolean: DataTypes.BOOLEAN
};

export function modelOf(obj) {
	const result = {};
	for (const key in obj) {
		result.key = dataTypes[typeof key];
	}
	return result;
};