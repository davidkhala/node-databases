export function e2e(db, databaseName) {

	it('connect, disconnect', async () => {
		db.connect();
		db.disconnect();
		db.connect();
	});

	it('create database', async () => {
		const create = `CREATE DATABASE ${databaseName}
AS PERMANENT = 60e6, -- 60MB
    SPOOL = 120e6; -- 120MB`;
		db.execute(create);
	});
	it('create table', () => {
		const employees = `CREATE SET TABLE ${databaseName}.Employees (
   GlobalID INTEGER,
   FirstName VARCHAR(30),
   LastName VARCHAR(30),
   DateOfBirth DATE FORMAT 'YYYY-MM-DD',
   JoinedDate DATE FORMAT 'YYYY-MM-DD',
   DepartmentCode BYTEINT
)
UNIQUE PRIMARY INDEX ( GlobalID );`;
		db.execute(employees);
	});
	it('insert sample rows', () => {
		const rows = `INSERT INTO ${databaseName}.Employees (
   GlobalID,
   FirstName,
   LastName,
   DateOfBirth,
   JoinedDate,
   DepartmentCode
)
VALUES (
   101,
   'Adam',
   'Tworkowski',
   '1980-01-05',
   '2004-08-01',
   01
);`;
		const result = db.query(rows);
		console.log(result);
	});

}

export function dba(db, databaseName) {

	it('get database', () => {
		const _dba = db.dba;
		const result = _dba.exist(databaseName);
		console.debug(result);
	});


	it('truncate table', () => {
		const _dba = db.dba;
		_dba.truncate(databaseName, 'Employees');
	});

	it('drop database', () => {
		const _dba = db.dba;
		_dba.drop(databaseName);
	});
}

export function cte(db, databaseName, cteTable) {
	it('RECURSIVE CTE', async () => {
		db.use(databaseName);
		db.execute(`CREATE TABLE ${cteTable}(a1 INT, b1 INT);`);
		const insert = `insert into t1(1,2);
insert into t1(1,4);
insert into t1(2,3);
insert into t1(3,4);`;
		// insert into is the ANSI standard, but the `into` is optional in mysql, SQL server and teradata
		//  INS == insert == insert into

		db.execute(insert);
		const cteQuery = `WITH
RECURSIVE s3 (MinVersion)  AS (SELECT a1 FROM ${cteTable} WHERE a1 > 1
                               UNION ALL
                              SEL MinVersion FROM s3 WHERE MinVersion > 3),
RECURSIVE s4 (MinVersion)  AS (SELECT a1 FROM ${cteTable} WHERE a1 = 2
                              UNION ALL
                              SEL MinVersion FROM S4 WHERE MinVersion > 2)
SEL * FROM s3,s4;`;
		const result = db.query(cteQuery, undefined, {withHeader: true});
		console.debug(result);

	});
}
