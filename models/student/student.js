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
    tokens_unsign:[
        {
            type: String
        }
    ],
    // 'dinh', 'the', 'dung', '20', 'at05'
    ngrams_unsign: [
        {
            type: String,
            index: true
        }
    ]
},{ timestamps: true});
schema.index({usign_search:1});
schema.index({tokens_unsign:1});
schema.index({ngrams_unsign:1});
schema.pre('save',function(next){
    const s = `${this.name ?? ''} ${this.age ?? ''} ${this.class_name ?? ''}`; // "Đinh Thế Dũng"  "20"  "at05" -> "Dinh The Dung 20 at05"
    this.unsign_search = toUnsign(s);
    this.tokens_unsign = tokenizeName(s);
    this.ngrams_unsign = simple_edge_n_grams(this.tokens_unsign);
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
        for(let i =0;i<500000;i++){
            const data = await new ModelStudent({
                name: randomVietnameseName(),
                age: Math.floor(Math.random()*100),
                birthday: new Date(),
                class_name: `${Math.floor(Math.random()*100)}`,
                gender: 'Nam',
                avatar: '/image/default-avatar.jpg'
            }).save();
            console.log(data);
        }
    } catch (error) {
        console.log(error);
    }
}
//init()
function randomVietnameseName() {
  const ho = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Phan", "Ngô", "Đinh"];
  const dem = ["Văn", "Thị", "Hữu", "Minh", "Ngọc", "Gia", "Anh", "Quốc", "Thanh","Khánh", "Huyền"];
  const ten = ["Nam", "Linh", "Hà", "Hùng", "Trang", "Dũng", "Lan", "Hải", "Tú", "Phương", "Huy","Tâm","An"];
  
  const h = ho[Math.floor(Math.random() * ho.length)];
  const d = dem[Math.floor(Math.random() * dem.length)];
  const t = ten[Math.floor(Math.random() * ten.length)];
  
  return `${h} ${d} ${t}`;
}