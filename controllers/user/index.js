const { sha512 } = require("js-sha512")
const ModelUser = require("../../models/user/user")
const jwt = require('jsonwebtoken')
const ModelToken = require("../../models/token/token")
exports.render_view_login = async (req, res) =>{
    try {
        const error = req.session.error
        req.session.destroy()
        return res.render('auth/login',{
            error: error
        })
    } catch (error) {
        console.log(error)
    }
}

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body
        if(!username || !password) throw new Error('Vui lòng nhập đầy đủ thông tin')

        const user = await ModelUser.findOne({username:username}).lean()
        if(!user) throw new Error('Tài khoản không tìm thấy')
        if(user.password != sha512(password)) throw new Error('Sai mật khẩu')

        delete user.password 
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
        res.cookie('tkw', token, { httpOnly: true }) // lưu token vào cooke
        await new ModelToken({user_id: user._id, token: token}).save() // lưu token vào ModelToken

        return res.redirect('/')
    } catch (error) {
        console.error(error)
        req.session.error = error.message
        return res.redirect('/login')
    }
}