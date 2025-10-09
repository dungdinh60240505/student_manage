const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const options = {
    useNewUrlParser: true,
    autoIndex: true, // this is the code I added that solved it all
    keepAlive: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
    useUnifiedTopology: true,
};

mongoose
exports.optsValidator = {
    runValidators: true,
    new: true,
}
mongoose.set('strictQuery', true);

mongoose
    .connect(process.env.DB_CONNECTION + process.env.DB_NAME, options)
    .then(() => {
        console.log(`db ${process.env.DB_NAME} is connected`)
        console.log(`==================== ${process.env.DB_NAME} is running... ====================`)
    })
    .catch((err) => console.log("Lỗi file connectDB", err))

exports.listCollections = async function () {
    try {
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Danh sách collections:');
        // collections.forEach(col => console.log(col.name));
        return collections.map(col => col.name);
    } catch (err) {
        console.error('Lỗi khi lấy collections:', err);
    }
}

