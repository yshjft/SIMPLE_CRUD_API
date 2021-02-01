const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path  = require('path')
const morgan = require('morgan')
const hpp = require('hpp')
const helmet = require('helmet')
require('dotenv').config()

const PostRouter = require('./routes/post')
const {sequelize} = require('./models')

const app = express()
app.set('port', process.env.PORT || 8004)
sequelize.sync()

if(process.env.NODE_ENV === 'production'){
    app.use(morgan('combined'))
    app.use(hpp())
    app.use(helmet())
}else {
    app.use(morgan('dev'))
}
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    proxy: true,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}))
app.use('/posts', PostRouter)

// 404 에러 핸들러
app.use((req, res, next)=>{
    const err = new Error()
    err.status = 404
    next(err)  
})

app.use((err, req, res, next)=>{
    //res.json 해주자
    console.error(err.status || 500, err.message)
})

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '버 포트에서 대기 중')
})