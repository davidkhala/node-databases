import MongoConnect from "@davidkhala/mongodb"
import AutonomousJSON from "@davidkhala/mongodb/autonomous.js"
import RedisClient from "@davidkhala/redis"

describe('constructor', () => {
	it('mongo', () => {
		const domain = 'abc'
		const username = 'admin'
		const password = 'pwd'
		new MongoConnect({domain, username, password})
		new AutonomousJSON({domain})
	})
	it('redis', () => {
		const endpoint = 'abc'
		new RedisClient({endpoint})
	})
})