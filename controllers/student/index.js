const ModelStudent = require("../../models/student/student")
const ModelUser = require("../../models/user/user")

exports.insert = async (req, res) => {
    try {
        const { name, birthday, age, class_name,gender } = req.body
        const data_user = await new ModelStudent({
            name: name,
            birthday: birthday,
            gender:gender,
            age: age,
            class_name: class_name,
            avatar: req.file.path.replace('public', ''),
            unsign_search: `${name} ${age} ${class_name} `
        }).save()

        return res.status(200).json(data_user)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}


exports.update = async (req, res) => {
    try {
        const { name, birthday, age, class_name,gender, id } = req.body
        const avatar = req.file?.path?.replace('public', '')
        const object = {
            name: name,
            birthday: birthday,
            gender:gender,
            age: age,
            class_name: class_name,
        }
        if(avatar) object.avatar = avatar
        const data_user = await ModelStudent.findOneAndUpdate({
            _id: id
        },object,{new:true})

        return res.status(200).json(data_user)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

exports.get_list_student = async (req, res) => {
    try {
        const {search } = req.query
        let limit = 10
        let page = 1

        if(req.query.limit){
            limit = parseInt(req.query.limit)
        }
        if(req.query.page){
            page = parseInt(req.query.page)
            if(page == 0) page = 1
        }
        let query = {}
        if(search){
            query = {
                unsign_search: {$regex:".*"+search+".*",$options:"i"},        
            }
        }

        console.time('get_list_student')
        const [
            data,
            count
        ] = await Promise.all([
            ModelStudent.find(query).sort({createdAt:-1}).skip((page-1)*limit).limit(limit).lean(),
            ModelStudent.countDocuments(query)
        ])
      
        console.timeEnd('get_list_student')
        return res.status(200).json({
            data,
            count,
            length: data.length,
            limit: limit,
            page:page
        })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

exports.remove_student = async (req, res) => {
    try {
        const {id} = req.params
        const data = await ModelStudent.deleteOne({_id:id})
        return res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}