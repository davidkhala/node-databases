import {SystemInfo, default as Teradata} from '../index.js'
import {Database, Table} from '../ddl.js'
import * as assert from "assert";

const database = 'HR'
describe('connection', function () {
    this.timeout(0)
    const teradata = new Teradata({host: '129.150.42.249'})
    it('connect, disconnect', function () {
        teradata.connect()
        teradata.disconnect()
    })
})

describe('SystemInfo', function () {
    this.timeout(0)

    const systemInfo = new SystemInfo({host: '129.150.42.249'})
    before(() => {
        systemInfo.connect()
    })

    it('version', async () => {
        const versionResult = systemInfo.version()
        assert.equal(versionResult, '17.20.03.02')
    })

    after(() => {
        systemInfo.disconnect()
    })
})
describe('vantage express sample', function () {
    this.timeout(0)
    const teradata = new Teradata({host: '129.150.42.249'})
    const databaseConnect = new Database(teradata)

    before(() => {
        teradata.connect()
        databaseConnect.connect()
    })
    it('get database', () => {
        const result = databaseConnect.exist(database)
        console.debug(result)
    })

    it('create database', async () => {
        const create = `CREATE DATABASE ${database}
AS PERMANENT = 60e6, -- 60MB
    SPOOL = 120e6; -- 120MB`
        teradata.execute(create)
    })
    it('create table', () => {
        const create = `CREATE SET TABLE ${database}.Employees (
   GlobalID INTEGER,
   FirstName VARCHAR(30),
   LastName VARCHAR(30),
   DateOfBirth DATE FORMAT 'YYYY-MM-DD',
   JoinedDate DATE FORMAT 'YYYY-MM-DD',
   DepartmentCode BYTEINT
)
UNIQUE PRIMARY INDEX ( GlobalID );`
        teradata.execute(create)
    })
    it('insert sample rows', () => {
        const rows = `INSERT INTO ${database}.Employees (
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
);`
        const result = teradata.query(rows)
        console.log(result)
    })
    it('truncate table', () => {
        databaseConnect.truncate(database, 'Employees')
    })

    it('drop database', () => {
        databaseConnect.drop(database)
    })
    after(() => {
        teradata.disconnect()
    })
})
describe('CTE', function () {
    this.timeout(0)

    const db = new Database({host: '129.150.42.249'})
    db.connect()
    const tbl = new Table(db)
    const tableName = 't1'
    before(() => {
        db.use(database)
        tbl.drop(tableName)
    })
    it('RECURSIVE CTE # INS == insert == insert into', async () => {

        db.execute(`CREATE TABLE ${tableName}(a1 INT, b1 INT);`)
        const insert = `insert into t1(1,2);
insert into t1(1,4);
insert into t1(2,3);
insert into t1(3,4);`
        // insert into is the ANSI standard, but the `into` is optional in mysql, SQL server and teradata

        db.execute(insert)
        const cteQuery = `WITH
RECURSIVE s3 (MinVersion)  AS (SELECT a1 FROM ${tableName} WHERE a1 > 1
                               UNION ALL
                              SEL MinVersion FROM s3 WHERE MinVersion > 3),
RECURSIVE s4 (MinVersion)  AS (SELECT a1 FROM ${tableName} WHERE a1 = 2
                              UNION ALL
                              SEL MinVersion FROM S4 WHERE MinVersion > 2)
SEL * FROM s3,s4;`
        const result = db.query(cteQuery, true)
        console.debug(result)

    })
    after(() => {
        db.disconnect()
    })
})
