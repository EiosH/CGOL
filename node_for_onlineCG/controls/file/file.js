const multer = require('koa-multer');

let storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, './public/avatar/')  //注意路径必须存在
    },
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})


//加载配置
module.exports =  multer({ storage: storage })
