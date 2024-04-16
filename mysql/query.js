export const database = {
    list: 'show databases'
}
export const user = {
    list: 'SELECT HOST,USER FROM mysql.user',
    create: (username, password) => {
        return `
        CREATE USER '${username}'@'%' IDENTIFIED BY '${password}';
        GRANT ALL PRIVILEGES ON *.* TO '${username}'@'%';
        `
    }
}