import 'dotenv/config'
import {defineConfig} from 'prisma/config'

export function configOf(databaseUrl) {
    defineConfig({
        schema: 'prisma/schema.prisma',
        migrations: {
            path: 'prisma/migrations',
        },
        datasource: {
            url: databaseUrl,
        },
    })
}
