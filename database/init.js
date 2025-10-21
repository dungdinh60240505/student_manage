const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
}


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



// DB_CONNECTION: mongodb://localhost:21707/

//DB_NAME: user


