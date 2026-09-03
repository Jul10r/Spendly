const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const getCollection = () => getDB().collection('transactions');


const getAllTransactions = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = {
            userId: new ObjectId(req.user.id),
            ...(type ? { type } : {})
        };

        const transactions = await getCollection()
            .find(filter)
            .sort({ createdAt: -1 })
            .toArray();

        res.json(transactions);
    } catch (err) {
        console.error("Error fetching transactions: ", err);
        res.status(500).json({ message: "Server error fetching transactions" });
    }
};

const createTransaction = async (req, res) => {
    try {
        const { type, amount, category, date, description } = req.body;

        if (!type || (type !== 'income' && type !== 'expense')) {
            return res.status(400).json({ message: "Type must be 'income' or 'expense'" })
        };

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ message: "Amount must be a positive number" })
        };

        if (!category || category.trim() === '') {
            return res.status(400).json({ message: "Category is required" })
        };

        const newTransaction = {
            userId: new ObjectId(req.user.id),
            type,
            amount: Number(amount),
            category: category.trim(),
            date: date || new Date().toISOString().split('T')[0],
            description: description ? description.trim() : '',
            createdAt: new Date()
        };

        const result = await getCollection().insertOne(newTransaction);

        res.status(201).json({
            message: "Transaction created successfully",
            transaction: { ...newTransaction, _id: result.insertedId }
        })

    } catch (err) {
        console.error("Error creating transcation: ", err)
        res.status(500).json({ message: "Server error creating transaction" })
    }
}

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        if (ObjectId.isValid(id) == false) {
            return res.status(400).json({ message: "Invalid Id" })
        }

        const result = await getCollection().deleteOne({
            _id: new ObjectId(id),
            userId: new ObjectId(req.user.id)
        })

        if (result.deletedCount == 0) {
            return res.status(404).json({ message: "Transaction not found" })
        };

        if (result.deletedCount == 1) {
            return res.status(200).json({ message: "Transaction deleted successfully" })
        }

    } catch (err) {
        console.error("Error deleting transaction", err)
        return res.status(500).json({ message: "Server error deleting transaction." })
    }
};

const updateTransaction = async (req, res) => {

    try {
        const { id } = req.params;

        if (ObjectId.isValid(id) == false) {
            return res.status(400).json({ message: "Invalid Id" })
        }

        const updates = {};

        if (req.body.type) updates.type = req.body.type;
        if (req.body.amount) updates.amount = Number(req.body.amount);
        if (req.body.category) updates.category = req.body.category.trim();
        if (req.body.date) updates.date = req.body.date;
        if (req.body.description !== undefined) updates.description = req.body.description.trim();

        const result = await getCollection().findOneAndUpdate(
            { _id: new ObjectId(id), userId: new ObjectId(req.user.id) },
            { $set: updates },
            { returnDocument: 'after' }
        )

        if (!result) {
            return res.status(404).json({ message: "Transaction not found" });
        };

        res.json({ message: "Transaction updated successfully", transaction: result });
    } catch (err) {
        console.error("Error updating transaction ", err)
        return res.status(500).json({ message: "Server error updating transaction" })
    }
}

const getSummary = async (req, res) => {
    try {
        const transactions = await getCollection().find({
            userId: new ObjectId(req.user.id)
        }).toArray();
        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                totalIncome += transaction.amount;
            } else {
                totalExpense += transaction.amount;
            }
        });

        const balance = totalIncome - totalExpense;

        res.json({ totalIncome, totalExpense, balance, transactionCount: transactions.length });
    } catch (err) {
        console.error("Error getting summary", err)
        return res.status(500).json({ message: "Server error getting transactions" })
    }

}


module.exports = {
    getAllTransactions,
    createTransaction,
    deleteTransaction,
    updateTransaction,
    getSummary
}
