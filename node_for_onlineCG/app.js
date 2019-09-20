const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('koa-router')();
const cors = require('koa2-cors');

const mongoose = require('mongoose');
const db = mongoose.connection;
const User = require('./models/User');


mongoose.connect('mongodb://localhost:27017/runoob', {useNewUrlParser: true, useUnifiedTopology: true});
db.on('open', function (err) {
    if (err) throw err;
    console.log('数据库连接成功')
})
//允许跨域

const app = new Koa()
app.use(bodyParser())
app.use(cors());




// next() 返回promise，前面添加await关键字后会返回求值结果
// async和await必须成对出现
// await 我们可以理解为求值关键字 例如await 100*100 得到的是10000
// 为了保证洋葱模型，koa中间件中都加 async和await

// app.use 注册中间件
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:8080')
    ctx.body = "ok"
    await next()
})

router.post('/user', async (ctx, next) => {
    ctx.body = "good"
    let {user, password} = ctx.request.body

})
router.post('/register', async (ctx, next) => {
    let {user, password} = ctx.request.body
    if(user===''||password===''){
        ctx.status=202
        ctx.body = "null"
        return
    }
    await User.findOne({
        user: user
    }).then(function (userInfo) {
        console.log(userInfo);
        if (userInfo) {
            // 表示数据库中有该记录
            console.log('用户名已经被注册了');
            ctx.body = "fail"

        } else {
            console.log('注册成功')
            ctx.body = 'success'
            const UserEntity = new User({
                user: user,
                password: password
            });
             UserEntity.save(function (error, doc) {
                if (error) {
                    console.log("error:" + error);
                } else {
                    console.log(doc);
                }
            })
        }
    },function () {
        log('ss')
    })


})

app.use(router.routes()); //作用：启动路由
app.use(router.allowedMethods()); // 作用： 这是官方文档的推荐用法,
// 我们可以 看到 router.allowedMethods()用在了路由匹配 router.routes()之后,
// 所以在当所有 路由中间件最后调用.此时根据 ctx.status 设置 response 响应头

// 设置服务器端口
app.listen(9999)
