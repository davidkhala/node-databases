import assert from "assert";

export const drop = 'V().drop()'


export class Vertex {
    /**
     *
     * @param type The Label of vertex
     * @param id
     */
    constructor(type, id) {
        this.type = type
        this.id = id
    }

    list() {
        return `V().hasLabel('${this.type}')`
    }

    create(properties) {
        const propertiesQuery = Object.entries(properties).reduce((str, [key, value]) => {
            return str + `.property('${key}', '${value}')`
        }, '')
        return `addV('${this.type}').property('id', '${this.id}')${propertiesQuery}`
    }

    static get count() {
        return 'V().count()'
    }
}

export class Edge {
    constructor(type) {
        this.type = type
    }

    add(from, to) {
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
