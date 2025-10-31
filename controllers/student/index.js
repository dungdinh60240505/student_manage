const ModelStudent = require("../../models/student/student")
const ModelUser = require("../../models/user/user")
const multer = require('multer')
const upload = multer({ dest: '/upload/'})

exports.insert = async (req, res) => {
    try {
        const { name, birthday, age, class_name,gender } = req.body
        if(!name || !birthday || !age || !class_name){
            return res.status(400).json({ error: 'Thiếu trường dữ liệu bắt buộc'})
        }
        let avtPath;
        if(req.file){
            avtPath = `/upload/${req.file.filename}`;
        }
        else{
            avtPath = `/image/default-avatar.jpg`;
        }
        const data_user = await new ModelStudent({
            name: name,
            birthday: birthday,
            gender:gender,
            age: age,
            class_name: class_name,
            avatar: avtPath,
            unsign_search: `${name} ${age} ${class_name} `
        }).save();

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

function toUnsign(s) {
  return s
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // bỏ dấu
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')            // đ → d
    .toLowerCase()
    .replace(/\s+/g, ' ')                              // gom khoảng trắng
    .trim();
}
function tokenizeName(raw=''){
    const s = toUnsign(raw);
    const cleaned = s.replace(/[-._,]/g,' ');
    const tokens = cleaned.split(' ').filter(Boolean);// tách
    const final = tokens.filter(t => /^[a-z0-9]+$/.test(t));
    return final;
}
function simple_edge_n_grams(tokens, min=1, max=8){
    const res = [];
    tokens.forEach(token => {
        const upto = Math.min(max,token.length);
        for(let i = min; i <= upto; i ++){
            res.push(token.slice(0,i));
        }}
    )
    return Array.from(new Set(res));
}

exports.get_list_student = async (req, res) => { // chạy mỗi khi getData()
    try {
        console.log("=======HAHAHA==========================");
        const { search: rawSearch } = req.query
        search = toUnsign(rawSearch || '');
        const tokens = tokenizeName(rawSearch || '');
        const ngrams = simple_edge_n_grams(tokens || '');


        let page = 1 // mặc định
        let limit = parseInt(req.query.limit) || 10; // nếu thay đổi limit khi GET thì lệnh này chạy
        if(req.query.page){
            page = parseInt(req.query.page) // nếu thay đổi page khi GET thì lệnh này chạy
            if(page == 0) page = 1
        }
        let query = {}
        if(search){
            const search_split = search.split(' ');
            const array = []
            search_split.forEach(item => {
                array.push({
                    $or: [
						{ unsign_search: { $regex: '.*' + item + '.*', $options: 'i' } }, 
					],
                })
            })
            query = {
                ...query,
                $and:[
                    ...array
                ]
            }
        }

      
        const [
            data,
            count
        ] = await Promise.all([
            ModelStudent.find(query).skip((page-1)*limit).limit(limit).lean(),//tìm data theo query->sắp xếp->bỏ qua lượng data ở số page trước->chặn trên=limit
            ModelStudent.countDocuments(query)
        ])

        return res.status(200).json({
            data,
            count,
            length: data.length,
            limit: limit,
            page:page
        })
        // trả về array document, số lượng document, độ dài data, limit=10, page
    } catch (error) {
        console.error(error)
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