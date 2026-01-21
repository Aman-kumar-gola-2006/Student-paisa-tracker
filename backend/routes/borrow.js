const express = require('express');
const router = express.Router();
const BorrowRecord = require('../models/BorrowRecord');

// Get borrow records
router.get('/', async (req, res) => {
    try {
        // Ideally filter by userId but for now fetch all
        const records = await BorrowRecord.find().sort({ date: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add Borrow Record
router.post('/', async (req, res) => {
    try {
        const { userId, personName, amount, type, status, date, proofUrl } = req.body;
        const record = await BorrowRecord.create({
            userId,
            personName,
            amount,
            type,
            status,
            date,
            proofUrl
        });
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Status
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await BorrowRecord.findByIdAndUpdate(id, { status });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
