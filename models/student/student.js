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
    },
    // phục vụ tìm kiếm
    unsign_search:{
        type: String,
        index: true
    },// dinh the dung 20 at05
    // tokens_unsign:[
    //     {
    //         type: String
    //     }
    // ],
    // // 'dinh', 'the', 'dung', '20', 'at05'
    // ngrams_unsign: [
    //     {
    //         type: String,
    //         index: true
    //     }
    // ]
},{ timestamps: true});
schema.index({usign_search:1});
schema.index({tokens_unsign:1});
schema.index({ngrams_unsign:1});

schema.post(['save','findOneAndUpdate'],async function(doc, next){
    if(doc){
        await ModelStudent.updateSearch(doc)
    }
    next();
})
function toUnsign(s='') {
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
const ModelStudent = mongoose.model('student', schema)
module.exports = ModelStudent
const init = async () =>{
    try {
        const data = await ModelStudent.find()
        let i = 1;
        for(let user of data){
            await ModelStudent.findOneAndUpdate({
                _id: user._id
            },{
                name: user.name,
            },{new:true})
            console.log(i++)
        }
    } catch (error) {
        console.log(error);
    }
}
// init()
function randomVietnameseName() {
  const ho = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Phan", "Ngô", "Đinh"];
  const dem = ["Văn", "Thị", "Hữu", "Minh", "Ngọc", "Gia", "Anh", "Quốc", "Thanh","Khánh", "Huyền"];
  const ten = ["Nam", "Linh", "Hà", "Hùng", "Trang", "Dũng", "Lan", "Hải", "Tú", "Phương", "Huy","Tâm","An"];
  
  const h = ho[Math.floor(Math.random() * ho.length)];
  const d = dem[Math.floor(Math.random() * dem.length)];
  const t = ten[Math.floor(Math.random() * ten.length)];
  
  return `${h} ${d} ${t}`;
}


ModelStudent.updateSearch = async (doc) =>{
    try {
        let search = ` ${convert_string_to_search(doc.name)} ${doc.age}`
        search += ` ${search.replace(/\s+/g, '')}`

        await ModelStudent.updateOne({
            _id: doc._id
        },{
            $set: {
                unsign_search: search,
            }
        })
        console.log("update thành côngc")
    } catch (error) {
        console.error(error);
    }   
}

function convert_string_to_search(chuoi)  {
	if (!chuoi) return ''
	chuoi = chuoi.toString()
	var normalized = `${escapehtml(chuoi)} ${chuoi?.normalize('NFD').replace(/[\u0300-\u036f]/g, '')} ${escapehtml(chuoi?.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))}`
	return normalized
}

function escapehtml(str) {
    str = str.toString();
    // Danh sách các ký tự cần thay thế
    const escapeChars = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;",
        ")": "&#041;",
        "(": "&#040;",
        "/": "&#047;",
        "\\": "&#092;",
        "`": "&#096;",
        "=": "&#061;",
        "%": "&#037;",
        ";": "&#059;",
        ":": "&#058;",
        ",": "&#044;",
        ".": "&#046;",
        "?": "&#063;",
        "!": "&#033;",
        "@": "&#064;",
        "#": "&#035;",
        "$": "&#036;",
        "^": "&#094;",
        "*": "&#042;",
        "+": "&#043;",
        "|": "&#124;",
        "[": "&#091;",
        "]": "&#093;",
        "{": "&#123;",
        "}": "&#125;",
        "~": "&#126;"
    };

    // Sử dụng replace với callback function để tránh lỗi thay thế nhiều lần
    str = str.replace(/[&<>"'()/\\`=%;:,?.!@#$^*+|[\]{}~]/g, (match) => escapeChars[match]);

    return str;
};

