// This file is no longer needed in Mongoose setup as we import models directly in routes
// But keeping it to avoid breaking imports if any files still use destructuring from models/index
const User = require('./User');
const Budget = require('./Budget');
const Expense = require('./Expense');
const BorrowRecord = require('./BorrowRecord');

module.exports = {
    User,
    Budget,
    Expense,
    BorrowRecord
};
