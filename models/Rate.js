const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rateSchema = new Schema({
    title: { type: String },
    rate: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: "User" },
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});

const Rate = mongoose.model('Rate', rateSchema);
module.exports = Rate;