<template>
    <transition name="el-zoom-in-top">

        <div id="hall">
            <!--            成员内容-->
            <div class="main">
                <div class="users" ref="users" :style="{'height':this.$parent.users.length * 18 + 'vw' }">
                    <div class="user" v-if="Object.keys(this.$parent.users).length === 0">
                        <el-row>
                            <div class="noOne">
                                当前没有人在线，快召唤你的小伙伴！
                            </div>
                        </el-row>
                    </div>
                    <ul>
                        <li class="user" :key="index" v-for="(user,index) in this.$parent.users"
                            :class="user.sex ==='女'? 'woman':'man'">
                            <el-row>
                                <el-col>
                                    <el-image class="avatar" fit="cover" :src="user.avatar"></el-image>
                                </el-col>

                                <el-col :offset="6" :span=6>
                                    <span class="name">{{user.name}}</span>
                                </el-col>
                                <el-col :span=1 v-show="user.sex">
                                    <div class="sex iconfont"
                                         :class="user.sex ==='女'? 'icon-lunkuodasan-':'icon-lunkuodasan-1'"
                                         :style="{'color': user.sex==='女'?color[0]:color[1]}"></div>
                                </el-col>
                                <div class="btn">
                                    <el-button class="el-icon-place" @click="playGame"></el-button>
                                    <el-button class="el-icon-chat-round"
                                               @click="displayChat('',user.name,user.avatar)">
                                        <el-badge v-show="privateUnread.includes(user.name)" is-dot></el-badge>
                                    </el-button>
                                </div>
                            </el-row>
                        </li>
                    </ul>
                </div>
                <div class="chatBtn" :style="{'opacity': Iconshow ? '1':'0.4'}">
                    <el-row>
                        <el-badge :value="commitBtnBadge" :max="9" class="item">
                            <el-button @click="displayChat" class="begin el-icon-s-comment" circle></el-button>
                        </el-badge>
                    </el-row>
                </div>
            </div>

            <!--            广播和私聊信息-->
            <transition name="el-zoom-in-bottom">
                <div class="MessageInput" v-show="MessageInputDisplay">
                    <div v-show="privateChating">
                        <el-row>
                            <el-col>
                                <el-image class="privateAvatar" fit="cover" :src="privatePeople.avatar"></el-image>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="messages" ref="messages">
                        <ul>
                            <li class="content" :key="item"
                                v-for="(message,item) in privateChating?privateChat[privatePeople.name]:MessageContent">
                                <el-row>
                                    <el-col :span="6">
                                        <el-image class="avatar" fit="cover" :src="message.avatar"></el-image>
                                        <el-col class="name">{{message.name}}</el-col>
                                    </el-col>
                                    <!--                                    <el-col class="message" :span="14"></el-col>-->
                                    <el-col class="message" :span="14"><span
                                            class="message">{{message.message}}</span><i
                                            class="iconfont icon-qipao chatBackground"></i></el-col>
                                    <el-col class="date" :span="3">{{message.date}}</el-col>
                                </el-row>
                            </li>
                        </ul>
                    </div>
                    <div class="input">
                        <el-row>
                            <el-col :span="20">
                                <el-input clearable placeholder="随便说点什么" v-model="inputMessage"></el-input>
                            </el-col>
                            <el-col :span="4">
                                <el-button @click="SendMessage" :type="inputBtnType">发送</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="close" @click="closeMessage">
                        <i class="el-icon-error"></i>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
    import BScroll from 'better-scroll'

    export default {
        name: "hall",

        data() {
            return {
                Iconshow: false,   //chat按钮隐藏
                color: ['#ff709d', '#7fe6f5'],  //性别颜色
                inputMessage: '',
                inputBtnType: 'info',
                MessageInputDisplay: true,
                messagesScroll: null,
                usersScroll: null,
                commitBtnBadge: 0,
                privateChat: {},  //私聊内容
                privateChatBuffer: {},  //私聊内容缓存  解决卡慢的问题
                privateChating: false,  //私聊框隐藏
                privatePeople: {},//私聊成员,
                privateUnread:[] //未读消息
            }
        },
        props: ['MessageContent', 'privateChatContent'],
        mounted() {
            //允许滑动
            this.usersScroll = new BScroll(this.$refs.users, {
                click: true,
            })
            this.messagesScroll = new BScroll(this.$refs.messages, {
                click: true,
                scrollbar: true,
                scrollY: true,
                stop: 0,
                startY: -5000,
                mouseWheel: {
                    speed: 20,
                    invert: false,
                    easeTime: 300
                }
            })
            this.MessageInputDisplay = false
        },
        methods: {
            displayChat(event, name, avatar) {   //群聊图标的隐藏显示
                if (name && avatar) {
                    this.privateChating = true  //私聊框显示
                    this.privatePeople = {name, avatar}  //给当前聊天框的对象赋值
                    this.privateUnread.splice(this.privateUnread.indexOf(this.name),1)  //删除未读红点提示
                } else {
                    this.privateChating = false  //私聊框隐藏
                    this.commitBtnBadge = 0  //红点显示数字
                }
                this.Iconshow = true
                setTimeout(() => {
                    this.Iconshow = false
                }, 5000)
                this.MessageInputDisplay = true
            },
            SendMessage() {
                let name = this.$parent.name
                let message = this.inputMessage
                let avatar = this.$parent.avatar
                let date = new Date().getHours() + ':' + new Date().getMinutes()

                if (name) {
                    if (message) {
                        if (!this.privateChating) {  //发送群聊
                            this.$socket.emit('broadcast', {
                                'name': name,
                                'message': message,
                                'date': date,
                                'avatar': avatar
                            })
                        } else {      //发送私聊
                            let chatTo = this.privatePeople.name
                            this.$socket.emit('privateChat', {
                                'chatFrom': name,
                                'message': message,
                                'date': date,
                                'chatTo': chatTo,
                                'name': name,
                                'avatar': avatar
                            })
                        }
                        this.inputMessage = ''
                    } else {
                        this.$message.info('写点东西再提交把！')
                    }

                } else {
                    this.$message.info('请补充个人信息')
                }
            },
            closeMessage() {
                this.MessageInputDisplay = false
            },
            playGame() {
                this.$message.info({
                    showClose: true,
                    message: '即将开通，敬请期待'
                });
            }
        },
        watch: {
            inputMessage() {
                this.inputBtnType = 'success'
            },
            MessageContent() {
                this.commitBtnBadge++
                const messagesList = this.$refs.messages.querySelectorAll('ul>li')
                this.messagesScroll.scrollToElement(messagesList[messagesList.length - 1], 100, true, true)
            },
            privateChatContent() {
                let chatFromData = this.privateChatContent
                let chat = chatFromData.chat
                if (this.privateChatBuffer[chat]) {
                    this.privateChatBuffer[chat].push(chatFromData)

                } else {
                    this.privateChatBuffer[chat] = [chatFromData]
                }
                this.privateUnread.push(chatFromData.name)
                this.privateChat = []   //先把聊天内容清空
                this.privateChat = this.privateChatBuffer
            }
        }
    }
</script>

<style scoped lang="stylus">
    #hall
        .main
            .users
                position relative
                top 24vw
                height 18vw
                z-index 10

                .user
                    height 18vw
                    width 100%
                    border-bottom #c6c6c6 solid 1px

                    &.woman
                        background: #ff709d22

                    &.man
                        background: #3ec8ff 22

                /* Safari 5.1 - 6.0 */

                .noOne
                    font-size 4.5vw
                    color #E6A23C
                    line-height 18vw

                .avatar
                    position absolute
                    top 3vw
                    left 6vw
                    height 10vw
                    width 10vw
                    border-radius 50%

                .name
                    position absolute
                    top 7.5vw
                    left 22vw
                    font-size 3.6vw
                    color #f0f0f0

                .sex
                    position absolute
                    top 12vw
                    left 15vw
                    font-size 3vw
                    font-weight bold

                .btn
                    position absolute
                    top 1vw
                    right 3vw

                    .el-button
                        margin 0
                        margin-right 3px
                        height 16vw
                        width 18vw
                        background #0000
                        border: 0
                        outline 0
                        color #f0f0f0
                        font-size 6vw

            .chatBtn
                position fixed
                z-index 10
                bottom 8em
                right 1em
                opacity 0.6
                background #0000

                .el-button
                    font-size 4vw

        .MessageInput
            position fixed
            left 0
            bottom 0
            z-index 20
            width 100%
            height 154vw
            background: -webkit-linear-gradient(left top, #0e1531, #16310a); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(bottom right, #0e1531, #16310a); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(bottom right, #0e1531, #16310a); /* Firefox 3.6 - 15 */
            background: linear-gradient(to bottom right, #0e1531, #16310a); /* 标准的语法 */

            .input
                position absolute
                bottom 0
                width 100%
                height 10vw

            .privateAvatar
                height 145vw
                -webkit-filter: brightness(50%) blur(5px); /* Chrome, Safari, Opera */
                filter: brightness(50%) blur(5px);

            .messages
                position absolute
                z-index 0
                overflow: hidden;
                bottom 16vw
                top 10vw
                height 135vw
                width 100%

                .content
                    margin-top 6vw
                    margin-bottom 4vw
                    height 16vw
                    width 100%
                    line-height 16vw
                    font-size 4.5vw
                    color #152e31

                    .name
                        position relative
                        color #fff
                        left 8vw
                        top -3vw
                        font-size 4vw
                        overflow hidden

                    .avatar
                        position absolute
                        left 2vw
                        top 2vw
                        height 12vw
                        width 12vw
                        border-radius 50%

                    .chatBackground
                        position absolute
                        z-index -10
                        left 22vw
                        top 0vw
                        font-size 65vw
                        color #f0f0f0

                    .message
                        text-align center

                    .date
                        font-size 3vw
                        color #3a8ee6


            .close
                position absolute
                right 4vw
                top 3vw
                height 10vw
                width 10vw
                font-size 12vw
                color #fff

</style>
