const express = require('express');
const router = express.Router();
const {
    getAllTransactions,
    createTransaction,
    deleteTransaction,
    updateTransaction,
    getSummary
} = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)

router.get('/summary', getSummary);

router.get('/', getAllTransactions);

router.post('/', createTransaction);

router.delete('/:id', deleteTransaction);

router.put('/:id', updateTransaction);

module.exports = router;