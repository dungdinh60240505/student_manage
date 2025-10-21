const express = require('express');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const app = express();
const port = 3000;
const cors = require('cors')
const bodyParser = require('body-parser')
const logger = require('morgan')
app.use(bodyParser.json({ limit: '50mb' }))
app.use(
	bodyParser.urlencoded({
		extended: true,
		limit: '50mb',
		parameterLimit: 10000,
	})
)
app.use(cors())
app.use(
    session({
        secret: 'user',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
)
app.use(cookieParser())
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.static('upload'))
app.use(logger('dev'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

require('./database/init')
require('./models/init_model')
const router = require('./router')
app.use(router)

