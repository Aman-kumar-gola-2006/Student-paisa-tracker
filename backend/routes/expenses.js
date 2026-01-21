const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get expenses (filter by budgetId)
router.get('/', async (req, res) => {
    try {
        const { budgetId } = req.query;
        const filter = {};
        if (budgetId) filter.budgetId = budgetId;

        const expenses = await Expense.find(filter).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add Expense
router.post('/', async (req, res) => {
    try {
        console.log('Adding expense:', req.body);
        const { userId, budgetId, category, amount, date, notes } = req.body;
        const expense = await Expense.create({
            userId,
            budgetId,
            category,
            amount,
            date,
            notes
        });
        console.log('Expense saved:', expense.id);
        res.json(expense);
    } catch (error) {
        console.error('Expense Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete Expense
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Expense.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
