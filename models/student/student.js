const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
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
    },
    unsign_search:{
        type: String,
        index: true
    }
})

const ModelStudent = mongoose.model('student', schema)
module.exports = ModelStudent

const init = async () =>{
    try {
        for(let i =0;i<100000;i++){
            const data = await new ModelStudent({
                name: `student ${i}`,
                age: i,
                birthday: new Date(),
                class_name: `class ${i}`,
                gender: 'Nam'
            }).save()
            console.log(data)
        }
    } catch (error) {
        
    }
}

// init()