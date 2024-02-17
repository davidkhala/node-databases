import {VantageExpress} from '../ve.js';
import {e2e, dba, cte} from './index.js';
import assert from 'assert';

const database = 'HR';


const teradata = new VantageExpress({domain: '35.241.102.81'});
describe('vantage express sample', function () {
	this.timeout(0);

	before(async () => {
		await teradata.connect();
	});


	it('version', async () => {
		const _dba = teradata.dba;
		const versionResult = _dba.version();
		assert.equal(versionResult, '17.20.03.09');
	});

	e2e(teradata, database);
	cte(teradata, database, 't1');
	it('create view', () => {
		const sql = `
        CREATE VIEW Employee_View AS   
            SELECT Emp_Id, First_Name, Last_Name, Department_No, BirthDate,
            FROM Employees;`;
	});
	dba(teradata, database);
	after(() => {
		teradata.disconnect();
	});
});
