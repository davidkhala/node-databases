export const Tests = [
    'mysqladmin status -uroot -p$MYSQL_ROOT_PASSWORD',
    'mysqladmin ping -uroot -p$MYSQL_ROOT_PASSWORD',
    'mysql -uroot -p$MYSQL_ROOT_PASSWORD -e "select 1"'
];

