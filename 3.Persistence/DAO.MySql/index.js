const usersTable = require('./db1.createTable.Users');
const booksAndCategoriesTables = require('./db2.createTables.BooksAndCategories');
const cartsAndDetailsTables = require('./db3.createTables.CartsAndDetails');


module.exports = {
    usersTable,
    booksAndCategoriesTables,
    cartsAndDetailsTables,
};