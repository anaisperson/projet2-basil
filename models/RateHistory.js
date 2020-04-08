const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rateHistorySchema = new Schema({
    mindHistory: { type: Number },
    bodyHistory: { type: Number },
    soulHistory: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: "User" },
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});

const RateHistory = mongoose.model('RateHistory', rateHistorySchema);
module.exports = RateHistory;