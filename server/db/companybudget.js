const mongoose = require('mongoose');

const CompanyBudgetSchema = new mongoose.Schema({
    budget: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('CompanyBudget', CompanyBudgetSchema);
