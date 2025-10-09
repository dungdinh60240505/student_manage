const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    class_name:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    birthday:{
        type: Date,
        required: true
    },
    avatar:{
        type: String,
        // required: true
    }
})

const ModelStudent = mongoose.model('student', schema)
module.exports = ModelStudent