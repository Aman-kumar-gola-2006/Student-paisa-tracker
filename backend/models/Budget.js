const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    totalIncome: {
        type: Number,
        default: 0
    },
    fixedRent: {
        type: Number,
        default: 0
    },
    savingsGoal: {
        type: Number,
        default: 0
    },
    lowBalanceThreshold: {
        type: Number
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

module.exports = mongoose.model('Budget', budgetSchema);
