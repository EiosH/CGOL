const Koa = require('koa')
const bodyParser = require('koa-bodyparser')  //处理表单
const IO = require('./controls/socket/socket');
const cors = require('koa2-cors');

const mongoose = require('mongoose');  //数据库
const db = mongoose.connection;

const path = require('path')     //静态文件
const static= require('koa-static')
//引入相关依赖

const Root = 'http://localhost:8888'
const Origin = 'http://localhost:8080'

mongoose.connect('mongodb://localhost:27017/runoob', {useNewUrlParser: true, useUnifiedTopology: true});//连接数据库
db.on('open', function (err) {
    if (err) throw err;
    // log('数据库连接成功')
})   //连接数据库

const router = require('./controls/router/router')  //引入路由

const app = new Koa()
IO(app)

app.use(bodyParser())
app.use(cors()); //允许跨域

app.use(static(path.join(__dirname + '/public')))
app.use(static(path.join(__dirname + '/node_modules')))


// app.use 注册中间件
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin',Origin)
    ctx.body = "ok"
    await next()
})



app.use(router.routes());
app.use(router.allowedMethods());




app.listen(process.env.PORT ||8888)
