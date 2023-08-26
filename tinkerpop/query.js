import assert from "assert";

export const drop = 'V().drop()'


export class Vertex {
    /**
     *
     * @param type The Label of vertex
     */
    constructor(type) {
        this.type = type
    }

    list() {
        return `V().hasLabel('${this.type}')`
    }

    hasProperty({key, value}) {
        let suffix
        if (key) {
            suffix = `hasKey('${key}')`
        }
        if (value) {
            suffix = `hasValue('${value}')`
        }
        if (key && value) {
            suffix = `has('${key}','${value}')`
        }
        return this.list() + `.` + suffix
    }


    create(properties) {
        const propertiesQuery = Object.entries(properties).reduce((str, [key, value]) => {
            return str + `.property('${key}', '${value}')`
        }, '')
        return `addV('${this.type}')${propertiesQuery}`
    }

    static get(id) {
        return `V(${id})`
    }

    static get count() {
        return 'V().count()'
    }
}

export class Edge {
    constructor(type) {
        this.type = type
    }

    create(from, to) {
        if (typeof from !== 'string') {
            assert.ok(from instanceof Vertex)
            from = from.id
        }
        if (typeof to !== 'string') {
            assert.ok(to instanceof Vertex)
            to = to.id
        }
        return `V('${from}').addE('${this.type}').to(g.V('${to}'))`
    }
}
