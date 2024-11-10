const mongoose = require('mongoose')
const { Schema } = mongoose;

const schema = new Schema({
    name : {type: String, required: true},
    email : {type: String, required: true, unique: [true, "email already exist"]},
    password : {type: String, required: true},
    token : {type: String, required : true}
}) 

exports.User = mongoose.model('Users', schema)
