const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema({
    user: {type: String},
    password: {type: String},
    name: {type: String},
    sex: {type: String},
    avatar: {type: String}
})

module.exports = mongoose.model('User', usersSchema);
