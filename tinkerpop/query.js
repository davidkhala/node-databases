export const drop = 'V().drop()'


export class Vertex {
    /**
     *
     * @param type The Label of vertex
     */
    constructor(type) {
        Object.assign(this, {type})
    }

    list() {
        return `V().hasLabel('${this.type}')`
    }

    add(id, properties) {
        const propertiesQuery = Object.entries(properties).reduce((str, [key, value]) => {
            return str + `.property('${key}', '${value}')`
        }, '')
        return `addV('${this.type}').property('id', '${id}')${propertiesQuery}`
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
        return `V('${from}').addE('${this.type}').to(g.V('${to}'))`
    }
}
