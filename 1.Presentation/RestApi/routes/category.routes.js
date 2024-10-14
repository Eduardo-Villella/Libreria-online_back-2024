const { Router } = require('express');

const { CategoryController } = require('../controllers/index');

const router = Router();
const categoryController = new CategoryController(); 


router.get('/', categoryController.getAll.bind(categoryController));
router.get('/:id', categoryController.getById.bind(categoryController));


module.exports = router;