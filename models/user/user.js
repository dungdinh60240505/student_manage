const mongoose = require('mongoose')
const sha512 = require('js-sha512')
const schema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    
})

const ModelUser = mongoose.model('user', schema)
module.exports = ModelUser

const init = async ()=>{
    try {
        const user = await ModelUser.estimatedDocumentCount()
        if(user == 0){
            const user = new ModelUser({
                username: 'admin',
                password: sha512('1')
            })
            await user.save()
        }
    } catch (error) {
        
    }
}
init()