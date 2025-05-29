import {Scope, SearchQuery, SearchRequest} from 'couchbase'
export class Search{
    /**
     *
     * @param {Scope} scope
     */
    constructor(scope) {
        this.scope = scope;
    }

    /**
     *
     * @param indexName
     * @param {SearchQuery} query
     */
    async query(indexName, query){
        const {rows} =  await this.scope.search(indexName, SearchRequest.create(query))
        return rows
    }
}