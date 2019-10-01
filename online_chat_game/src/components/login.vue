<template>
    <div id="login">
        <img class="background" style="width: 100%; height: 100%" :src="url">
        <el-container>
            <!--            撑起顶部-->
            <el-header class="header">
            </el-header>
            <!--            主体内容-->
            <el-main>
                <el-avatar class="avatar" :size="size" src="img/default_avatar/avatar.jpg"></el-avatar>
                <el-row class="log">
                    <el-col class="Email">
                        <el-input class="myInput" v-model="logUser" placeholder="用户名"></el-input>
                    </el-col>

                </el-row>

                <el-row class="log">
                    <el-input class="myInput" v-model="logPassword" placeholder="密 码" minlength="6"
                              show-password></el-input>
                </el-row>
                <transition name="el-zoom-in-top">
                    <el-row class="log transition-box" v-show="!register">
                        <el-input class="myInput" v-model="logEnsurePassword" placeholder="确认密码" minlength="6"
                                  show-password></el-input>
                    </el-row>
                </transition>
                <el-row class="register">
                    <el-col>
                        <el-button :loading="logLoading" @click="submit" :span="12" round>{{register?log[0]:log[1]}}
                        </el-button>
                    </el-col>
                </el-row>

                <el-row class="lonIn">
                    <el-col>
                        <span :span="6" round>{{register?log[2]:log[3]}}<span @click="exchange" style="color: #E6A23C">{{register?log[1]:log[0]}}</span></span>
                    </el-col>
                </el-row>


            </el-main>

        </el-container>
    </div>
</template>


<script>
    import md5 from 'js-md5'

    export default {
        name: "login",
        mounted() {
            let bodyWidth = document.body.clientWidth;   //获取屏幕宽度设置默认头像size
            if (bodyWidth > 500) {
                this.size = 80
            }
        },
        data() {
            return {
                log: ['登录', '注册', '没有账户？', '已注册?'],
                register: true,  //登录状态
                size: 50,   //默认头像size
                url: 'img/background/blur.png',  //默认头像
                logUser: '',
                logPassword: '',
                logEnsurePassword: '',
                logLoading: false   //隐藏提交按钮的加载图标
            }
        },
        methods: {
            submit() {  //提交登录或注册
                let user = {user: this.logUser, password: md5(this.logPassword.toUpperCase())}  //获取input的用户并加密密码
                const api = this.$parent.api   //获取提交地址
                if (this.register) {   //已登录状态
                    this.logLoading = true    //显示登录加载图标
                    this.axios.post(api + 'user', user)
                        .then((response) => {
                            if (response.data === 'success') {
                                this.$message({
                                    message: '登录成功',
                                    type: 'success',
                                    duration: 1000
                                })
                                this.register = true
                                this.$emit('changeLoged')
                                this.axios.post(api + 'updataInfo', {user: this.logUser}).then(response => {
                                    if (response.data) {
                                        let {name, sex, avatar} = response.data
                                        if (name && sex) {
                                            this.$parent.name = name
                                            this.$parent.sex = sex
                                            this.$parent.user = this.logUser
                                            this.$socket.emit('user', {'user':this.$parent.user,'name': this.$parent.name,'id':this.$parent.websocketid,
                                            'sex':this.$parent.sex,'avatar':avatar})
                                        }
                                        if (!avatar.includes('undefined')) {
                                            this.$parent.avatar = avatar
                                        }
                                    }
                                })

                            } else if (response.data === 'fail') {
                                this.$message({
                                    message: '用户名或密码不正确',
                                    type: 'warning',
                                    duration: 1000
                                })
                            }
                            this.logLoading = false  //隐藏登录加载图标

                        }).catch(err => {
                        if (err) {
                            this.$message({
                                message: '网络异常',
                                type: 'warning',
                                duration: 1500
                            })
                        }
                        this.logLoading = false  //隐藏登录加载图标

                    })
                } else {      //未登录状态
                    this.logLoading = true    //显示登录加载图标
                    if (this.logPassword.length >= 6) {
                        if (this.logEnsurePassword === this.logPassword) {
                            this.axios.post(api + 'register', user)
                                .then(response => {
                                    if (response.data === 'success') {
                                        this.$message({
                                            message: '注册成功',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.register = true
                                    } else if (response.data === 'fail') {
                                        this.$message({
                                            message: '用户名已经有人用啦',
                                            type: 'warning',
                                            duration: 1000
                                        });
                                    }
                                    this.logLoading = false  //隐藏登录加载图标
                                })
                                .catch(err => {
                                    if (err) {
                                        this.$message({
                                            message: '网络异常',
                                            type: 'warning',
                                            duration: 1500
                                        })
                                    }
                                    this.logLoading = false  //隐藏登录加载图标
                                })
                        } else {
                            this.$message({
                                showClose: true,
                                message: '密码输入不一致',
                                type: 'error',
                                duration: 1000
                            });
                        }
                    } else {
                        this.$message({
                            showClose: true,
                            message: '密码最少6位',
                            type: 'error',
                            duration: 1000
                        });

                    }
                }
            },
            exchange() {
                this.register = !this.register  //切换登录或注册
            }
        }
    }
</script>

<style lang="stylus">
    #login
        .background
            position fixed
            top 0
            left 0
            z-index -10

        .header
            width 100%
            color #fcfcfc
            font-size 15px
            line-height 90px
            margin-bottom 4vw

            .icon
            .title
                text-align center

        .el-main
            .avatar
                margin-top 4vw
                margin-bottom 4vw

            .log
                margin-top 2vw
                margin-bottom 2vw

                .el-autocomplete
                    display block

                .BtnCaptcha
                    position relative
                    top 2vw
                    right 8vw
                    background-color #fff0
                    width 4em
                    border 0
                    color #222
                    font-size 14px


                .el-input__inner
                    background-color: #fff0
                    border 0
                    border-bottom 1px solid rgba(71, 97, 110, 0.72)
                    border-radius 0
                    display: inline-block
                    padding-top 2vw
                    padding-left 5px
                    font-size: 3.5vw
                    height: 12vw
                    line-height: 12vw
                    width: 70%
                    color #5B696C

                .el-input__inner::-webkit-input-placeholder /* WebKit browsers */
                    color: #5B696C

            .register
                margin-top 16vw

                .el-button
                    height 7.2vw
                    width 15vw
                    font-size 3.4vw
                    padding 0

            .lonIn
                margin-top 20px
                font-size 3vw
                color #d1dbe5

    .el-footer
        position absolute
        bottom 10px
        width 100%

        .el-row
            color rgba(209, 219, 229, 0.43)
            font-size 14px

</style>
