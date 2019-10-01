const router = require('koa-router')();
const multer = require('../file/file')
const User = require('../models/User');
const Root = 'http://localhost:8888'
const Origin = 'http://localhost:8080'

router.post('/user', async (ctx, next) => {
    ctx.body = "good"
    let {user, password} = ctx.request.body
    await User.findOne({
        user: user,
        password: password
    }).then(userInfo => {
        if (userInfo) {
            ctx.body = "success"
        } else {
            ctx.body = "fail"
        }
    })

})
router.post('/register', async (ctx, next) => {
    let {user, password} = ctx.request.body
    if (user === '' || password === '') {
        ctx.status = 202
        ctx.body = "null"
        return
    }
    await User.findOne({
        user: user
    }).then(userInfo => {
        if (userInfo) {
            // 表示数据库中有该记录
            ctx.body = "fail"

        } else {
            ctx.body = 'success'
            const UserEntity = new User({
                user: user,
                password: password
            });
            UserEntity.save()
        }
    })


})
router.post('/uploadImg', multer.single('file'), async (ctx, next) => {
    ctx.body = ctx.req.file.filename

})
router.post('/uploadForm', async (ctx, next) => {
    let {user, name, sex, avatar} = ctx.request.body
    await User.updateOne({user: user}, {
        name: name,
        sex: sex,
        avatar: avatar
    }).then(userInfo => {
        if (userInfo) {
            ctx.body = "success"
        } else {
            ctx.body = "fail"
        }
    })
})
router.post('/updataInfo', async (ctx, next) => {
    let user = ctx.request.body.user
    await User.findOne({user: user}, function (err, ret) {
        if (err) {
            ctx.body = "fail"
        } else {
            let userInfo = ret
            if (!userInfo.name) {
                userInfo.name = '未命名'
            }
            if (!userInfo.sex) {
                userInfo.sex = '男'
            }
            if (!userInfo.avatar) {
                userInfo.avatar = `${Root}/avatar/defaultAvatar.jpg`
            } else {
                userInfo.avatar = `${Root}/avatar/${userInfo.avatar}`
            }

            ctx.body = userInfo
        }
    })
})

module.exports = router
