import {SystemInfo, default as Teradata} from '../index.js'
import {Database} from '../ddl.js'
import * as assert from "assert";

describe('connect', function () {
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
    const database = 'HR'
    before(() => {
        teradata.connect()
        databaseConnect.connect()
    })
    it('get database', () => {
        const result = databaseConnect.exist(database)
        console.debug(result)
    })

    it('create database', async () => {
        const create = `CREATE DATABASE HR
AS PERMANENT = 60e6, -- 60MB
    SPOOL = 120e6; -- 120MB`
        teradata.execute(create)
    })
    it('create table', () => {
        const create = `CREATE SET TABLE HR.Employees (
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
        const rows = `INSERT INTO HR.Employees (
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
        databaseConnect.truncate('HR','Employees')
    })

    it('drop database', () => {
        databaseConnect.drop(database)
    })
    after(() => {
        // databaseConnect.disconnect()
        teradata.disconnect() // FIXME: Error: 0 is not a valid rows handle
    })
})
describe('CTE', function () {
    this.timeout(0)
    it('', async () => {
        const teradata = new Teradata({host: '129.150.42.249'})
        teradata.connect()
        teradata.query('CREATE TABLE t1(a1 INT, b1 INT);')
    })
})
