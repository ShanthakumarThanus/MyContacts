const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contactSchema = new Schema({
    "firstName": {
        "type": "String",
        required: true,
    },
    "lastName": {
        "type": "String",
    },
    "phone": {
        "type": "String",
        required: true,
        minlength: 10,
        maxlength: 20
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Contact', contactSchema);