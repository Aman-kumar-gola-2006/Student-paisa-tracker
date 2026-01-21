const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// Get all budgets for a user
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: 'userId IS REQUIRED' });
        }
        const budgets = await Budget.find({ userId });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create/Update Budget
router.post('/', async (req, res) => {
    try {
        const { id, userId, month, year, totalIncome, fixedRent, savingsGoal, lowBalanceThreshold } = req.body;

        let budget;
        if (id) {
            budget = await Budget.findById(id);
        }

        if (budget) {
            // Update
            budget.totalIncome = totalIncome;
            budget.fixedRent = fixedRent;
            budget.savingsGoal = savingsGoal;
            budget.lowBalanceThreshold = lowBalanceThreshold;
            await budget.save();
        } else {
            // Create
            budget = await Budget.create({
                userId,
                month,
                year,
                totalIncome,
                fixedRent,
                savingsGoal,
                lowBalanceThreshold
            });
        }

        res.json(budget);
    } catch (error) {
        console.error('Budget Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
