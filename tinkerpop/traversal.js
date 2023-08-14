export const drop = 'V().drop()'


export class Vertex {
    /**
     *
     * @param type The Label of vertex
     * @param partitionKey
     */
    constructor(type, partitionKey = 'partitionKey') {
        Object.assign(this, {type, partitionKey})
    }

    add(id, properties, partitionValue = id) {
        const propertiesQuery = Object.entries(properties).reduce((str, [key, value]) => {
            return str + `.property('${key}', '${value}')`
        }, `.property('${this.partitionKey}', '${partitionValue}')`)
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
