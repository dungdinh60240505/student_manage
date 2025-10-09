const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true
    },
    token:{
        type: String,
        required: true
    },
    
})

const ModelToken = mongoose.model('token', schema)
module.exports = ModelToken