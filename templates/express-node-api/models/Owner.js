const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true }
});

const Owner = mongoose.model('Owner', ownerSchema);

module.exports = Owner;