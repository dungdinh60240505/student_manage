const ModelUser = require("../models/user/user")
const ModelToken = require("../models/token/token")
const jwt = require('jsonwebtoken')
exports.authenToken = async (req, res, next) => {
	try {
     
		const token = req.cookies.tkw
      
		if (!token) throw new Error('Không tìm thấy token')

		const auth = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
		if (!auth) throw new Error('Không tìm thấy token')
	
        const data_token = await ModelToken.findOne({token: token})
        if(!data_token) throw new Error('Không tìm thấy token')

        const data_user = await ModelUser.findById(auth._id)
        delete data_user.password
        if (data_user) {
            req.auth = {
                ...auth,
                ...data_user,
                token: token,
            }
        }
		else{
			throw new Error('Không tìm thấy token')
		}

		next()
	} catch (error) {
		console.error(error)
		res.clearCookie('token')
        req.session.error = error.message
		return res.redirect('/login')
	}
}