import {DataTypes as baseDataTypes} from '@davidkhala/sequelize/index.js';

const MySQLDataTypes = Object.assign({TIMESTAMP: 'TIMESTAMP'}, baseDataTypes);// no any match for mysql dataType:TIMESTAMP
export {MySQLDataTypes as DataTypes};
