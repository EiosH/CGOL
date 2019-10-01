<template>
    <div id="app" @touchmove.prevent @scroll.prevent>
        <!--        登录界面-->
        <div class="login">
            <v-login v-on:changeLoged="getChangeLoged" v-if="!logged" class="animated fadeIn"></v-login>
        </div>
        <!--        背景图片-->
        <img class="background" style="width: 100%; height: 100%" src="img/background/blur.jpg">
        <!--顶部个人信息等-->
        <div class="top" v-show="logged">
            <el-row>
                <el-col>
                    <el-image class="avatar" :size="50" :src="avatar" :preview-src-list="[avatar]"
                              fit="cover"></el-image>
                </el-col>
                <el-col>
                    <i @click="routerPush" class="iconPush" :class="upDownClass?upDown.down:upDown.up"></i>
                </el-col>
                <div class="name">{{name}}</div>
                <div class="sex iconfont" :class="sex ==='女'? 'icon-lunkuodasan-':'icon-lunkuodasan-1'"
                     :style="{'color': sex==='女'?color[0]:color[1]}"></div>
            </el-row>
        </div>
        <!--        主体切换卡-->
        <div class="main" v-show="logged">
            <keep-alive>
                <router-view :MessageContent="MessageContent" :privateChatContent="privateChatContent"></router-view>
            </keep-alive>
        </div>
    </div>

</template>

<script>
    import login from './components/login'
    import './assets/iconfont/iconfont.css'


    export default {
        name: 'app',
        components: {
            'v-login': login   //登录状态

        },
        created() {
        },
        data() {
            return {
                api: 'http://localhost:8888/',  //服务器地址
                user: '',  //用户
                users: [], //在线用户
                logged: false,  //登录状态
                sex: '',
                name: '',
                avatar: 'img/default_avatar/avatar.jpg', //默认头像
                color: ['#ff709d', '#7fe6f5'],  //性别颜色
                upDown: {down: 'el-icon-arrow-down', up: 'el-icon-arrow-up'},  //上拉下拉图标
                upDownClass: true,  //上拉下拉切换
                MessageContent: [],   //广播内容
                privateChatContent:{}  //私聊内容
            }
        },
        methods: {
            getChangeLoged() {
                this.logged = !this.logged
            },
            routerPush() {    //切换卡
                if (this.upDownClass) {
                    this.$router.push('/personalInfor')
                } else {
                    this.$router.push('/hall')
                }
                this.upDownClass = !this.upDownClass
            }
        },
        sockets: {
            //这里是监听connect事件
            connect() {
                // 获取每台客服端生成的id
                this.websocketid = this.$socket.id;
            },
            broadcast(data) {    // 监听广播信息
                this.MessageContent.push(data)
            },
            privateChat(data) {
                this.privateChatContent = data
            },
            user(data) {
                delete data[this.user]
                this.users = data
            },
            // 监听断开连接
            disconnect() {
                this.$socket.emit('userLeave', {'user': this.$parent.user})
            }
        }
    }
</script>

<style lang="stylus">
    #app
        font-family: 'Avenir', Helvetica, Arial, sans-serif
        -webkit-font-smoothing: antialiased
        -moz-osx-font-smoothing: grayscale
        text-align: center

        .background
            position fixed
            top 0
            left 0
            z-index -10

        .top
            position absolute
            border-bottom dashed 1px #d3dce655
            height 24vw
            width 100%
            top 0
            line-height 25vw
            z-index 100
            background #0D1931

            .avatar
                position absolute
                left 6vw
                top 7vw
                border-radius 50%
                height 14vw
                width 14vw

                .el-icon-circle-close
                    color #ccc



            .iconPush
                position absolute
                top 12vw
                right 8vw
                font-size 18px
                color #d3dce6

            .name
                position absolute
                top .5em
                left 7em
                font-size 4vw
                color #d3dce6
                font-weight bold

            .sex
                position absolute
                top 1.5em
                left 4em
                font-size 4vw
                font-weight bold


</style>
