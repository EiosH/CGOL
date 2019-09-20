const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/runoob', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('open', function (err) {
    if (err) throw err;
    console.log('数据库连接成功')
})


//定义Schema，描述该集合有哪些字段，哪些类型，只有Schema中定义过的，才能被放入数据库中
const UserSchema = new mongoose.Schema({
    user: {type: String},
    password: {type: String}
})

const UserModel = db.model('user', UserSchema);


async function  Add(user,password) {
    const UserEntity = new UserModel({
        user: user,
        password : password
    });
    await Search(user)
    // await UserEntity.save(function (error, doc) {
    //     console.log('kkkkkkkkk')
    //     if (error) {
    //         console.log("error:" + error);
    //     } else {
    //         console.log(doc);
    //     }
    // })
}
Add('王',"123")
async function Search(user){
    console.log(user);
    await  UserModel.find({}, function (err, docs) {
        console.log(docs);
    })
    // await UserModel.remove({})
}
// Search()



db.on('error', function (err) {
    console.log('error:' + err)
})
db.once('disconnected', function () {
    console.log('数据库关闭')
})





