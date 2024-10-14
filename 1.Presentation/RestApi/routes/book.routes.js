const { Router } = require('express');

const { BooksController } = require('../controllers/index');


const router = Router();
const booksController = new BooksController(); 


router.get('/', booksController.getAll.bind(booksController));
router.get('/:id', booksController.getById.bind(booksController));

// Command routes definition:
router.post('/', booksController.createBook.bind(booksController));
router.put('/:id', booksController.updateBook.bind(booksController));
router.delete('/:id', booksController.deleteBook.bind(booksController));


module.exports = router;

