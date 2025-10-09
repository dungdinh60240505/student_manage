const ModelStudent = require("../../models/student/student")
const ModelUser = require("../../models/user/user")

exports.insert = async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.file)
        const { name, birthday, age, class_name,gender } = req.body
        const data_user = await new ModelStudent({
            name: name,
            birthday: birthday,
            gender:gender,
            age: age,
            class_name: class_name,
            avatar: req.file.path.replace('public', '')
        }).save()

        return res.status(200).json(data_user)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

exports.get_list_student = async (req, res) => {
    try {
        const {search} = req.query
        let query = {}
        if(search){
            query = {
                name: {$regex:".*"+search+".*",$options:"i"}
            }
        }
        const data = await ModelStudent.find(query).lean()
        return res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}