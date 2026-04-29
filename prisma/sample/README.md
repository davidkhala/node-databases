

# hello-prisma
Ref: https://github.com/prisma/prisma-examples/tree/latest/databases/prisma-postgres
1. Scaffold the starter project
    ```
    npx try-prisma@latest --template databases/prisma-postgres --name hello-prisma --install npm
    cd hello-prisma
    npm install # bun install?
    ```
2. Create a temporary Prisma Postgres database
   ```
   npx create-db@latest --quiet --env .env
   ```
   - By setting `--ttl`, it can last for from `30m` to `24h`
   - > Claim your database at the provided URL to keep it permanently. 
3. Push the schema & generate Prisma Client
   ```
   npx prisma db push
   npx prisma generate
   ```
4. `npm run dev`
   