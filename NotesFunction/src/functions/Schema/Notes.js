const mongoose = require('mongoose')
const { Schema } = mongoose;

const schema = new Schema({
    title : {type: String},
    description : {type: String},
    color: {type: String},
    userId : {type : String, required: true}
}) 

exports.Notes = mongoose.model('Notes', schema)
