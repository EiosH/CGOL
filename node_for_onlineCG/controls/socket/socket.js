const IO = require('koa-socket-2');
const io = new IO();
const user_online = {}

socket = (app) => {
    let unreadMessage = 0
    const chat = new IO({
        namespace: 'chat'
    });
    io.attach(app);
    io.on('connection', (ctx, data) => {
        // log('登录');
    });
    io.on('disconnect', (ctx, data) => {
        Object.keys(user_online).forEach(item => {
            if (user_online[item]['id'] === ctx.socket.id) {
                delete user_online[item]
                io.broadcast('user', user_online)
            }
        })
    })
    io.on('broadcast', (ctx, data) => {
        io.broadcast('broadcast', data)
    })
    io.on('user', (ctx, data) => {
        let user = data
        // if (user.user && user.id && user.name){
        // if(user_online.user === user.user)
        user_online[user.user] = user
        // }
        io.broadcast('user', user_online)
    })
    io.on('privateChat', (ctx, data) => {
        // io.broadcast('broadcast', data)
        let [chatToFrom, name, message, date, avatar] = [[data.chatTo, data.chatFrom], data.name, data.message, data.date,data.avatar]

        let idChatToFrom = []
        Object.keys(user_online).forEach(item => {
            if (!idChatToFrom[0]) {
                if (user_online[item]['name'] === chatToFrom[0]) {
                    idChatToFrom[0] = user_online[item].id
                }
            }
            if (!idChatToFrom[1]) {
                if (user_online[item]['name'] === chatToFrom[1]) {
                    idChatToFrom[1] = user_online[item].id
                }
            }
        })
        if (idChatToFrom) {
            let content = {
                'name': name,
                'message': message,
                'date': date,
                'avatar':avatar
            }
            content['chat'] = chatToFrom[1]
            io.to(idChatToFrom[0]).emit('privateChat', content)
            content['chat'] = chatToFrom[0]
            io.to(idChatToFrom[1]).emit('privateChat', content)
        }
    })

    // chat.broadcast('allmessage', '广播消息')
}

module.exports = socket
