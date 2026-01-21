const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    personName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['Lent', 'Borrowed'],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Returned'],
        default: 'Pending'
    },
    date: {
        type: String,
        required: true
    },
    proofUrl: {
        type: String
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

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);
