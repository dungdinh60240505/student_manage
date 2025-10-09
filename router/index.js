// require("express-router-group"); // ⚠️ phải đặt ở dòng đầu
const express = require("express");
const { authenToken } = require("../middleware/auth");
const router = express.Router();
const { middleware_upload_single } = require("../middleware/upload");
const home = require('../controllers/home/index')
router.get("/", authenToken, home.render_view_index);

const user = require('../controllers/user/index')
router.get("/login", user.render_view_login);
router.post("/login", user.login);

const student = require('../controllers/student/index');

router.post("/student-add", authenToken, middleware_upload_single('avatar','public/upload/avatar'), student.insert);
router.get("/student-list", authenToken, student.get_list_student);
module.exports = router