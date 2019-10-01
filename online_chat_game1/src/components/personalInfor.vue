<template>
    <transition name="el-zoom-in-top">

        <div id="personalInfor">

            <div class="avatar">
                <el-upload
                        class="avatar-uploader"
                        :action="avatarAction"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                    <el-image  shape="square" style="width: 100px; height: 100px" :src="avatarImg" fit="scale-down"></el-image>
                </el-upload>
            </div>
            <el-form>
                <div class="main">
                    <div class="edit">
                        <el-row>
                            <el-col :offset="4" :span="3"><span class="text">昵称</span></el-col>
                            <el-col :span="10" class="name">
                                <el-form-item>
                                    <el-input class="myInput" v-model="name"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="edit">
                        <el-row>
                            <el-col :offset="4" :span="3"><span class="text">性别</span></el-col>
                            <el-col :span="10">
                                <el-form-item>

                                    <el-radio-group v-model="sexRadio">
                                        <el-radio-button label="男"></el-radio-button>
                                        <el-radio-button label="女"></el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <el-row class="commit">
                    <el-col>
                        <el-form-item>
                            <el-button type="success" @click="commit" :span="12" icon="el-icon-thumb" round>提交
                            </el-button>

                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

    </transition>

</template>

<script>
    export default {
        name: "personalInfor",
        data() {
            return {
                sexRadio: '',
                name: '',
                avatar: '',
                avatarImg:'img/default_avatar/avatar.jpg',
                avatarAction:'http://localhost:8888/uploadImg'
            };
        },
        mounted() {
            this.name = this.$parent.name //把个人信息填充进来
            this.sexRadio = this.$parent.sex
            this.avatarImg = this.$parent.avatar || 'img/default_avatar/avatar.jpg'
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                this.avatarImg = this.imageUrl
                this.avatar = res
            },
            beforeAvatarUpload(file) {
                const ImgType = ['image/jpeg', 'image/png', ' image/jpg'];
                let isImg = ImgType.includes(file.type);
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isImg) {
                    this.$message.error('上传头像图片只能是 jpg/png 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isImg && isLt2M;
            },
            commit() {
                const config = {
                    headers: {'Content-Type': 'application/json'}
                }
                const api = this.$parent.api
                if (this.name === '' || this.sexRadio === '') {
                    this.$message.error('信息不完整');
                } else {
                    const avatar = this.avatar||'defaultAvatar.jpg'
                    const name = this.name;
                    const sex = this.sexRadio;
                    const user = this.$parent.user;
                    if (name && sex && user) {
                        let Data = {
                            'avatar': avatar,
                            'name': name,
                            'sex': sex,
                            'user': user
                        };
                        this.axios.post(api + 'uploadForm', Data, config).then(response => {
                            if (response.data === 'success') {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success',
                                    duration: 1000
                                })
                            }
                        })
                        this.axios.post(api + 'updataInfo', {user: user}).then(response => {
                            if (response.data) {
                                let {name, sex, avatar} = response.data
                                this.$parent.name = name
                                this.$parent.sex = sex
                                this.$parent.avatar = avatar
                                this.$socket.emit('user', {'user':this.$parent.user,'name': name,'id':this.$parent.websocketid,
                                    'sex':sex,'avatar':avatar})
                            }
                        })
                    }
                }
            }
        }
    }
</script>

<style lang="stylus">
    #personalInfor
        .avatar
            margin-top 35vw

            .avatar-uploader .el-upload {
                border: 1px dashed #efefef88;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }

            .avatar-uploader .el-upload:hover {
                border-color: #c6c6c6;
            }

            .avatar-uploader-icon {
                font-size: 28px;
                color: #8c939d;
                width: 178px;
                height: 178px;
                line-height: 178px;
                text-align: center;
            }

            .avatar {
                width: 178px;
                height: 178px;
                display: block;
            }

        .main
            .edit
                margin-top 40px

                .text
                    color #ececec
                    height: 50px
                    line-height: 50px
                    font-size: 17px

                .el-input__inner
                    background-color: #fff0
                    border 0
                    border-bottom 1px solid rgba(71, 97, 110, 0.72)
                    border-radius 0
                    display: inline-block
                    padding-left 5px
                    font-size: 17px
                    height: 40px
                    line-height: 40px
                    width: 70%
                    color #ececec

                .el-radio-button__inner
                    background-color: #fff8
                    border 0
                    outline 0

        .commit
            margin-top 3em
</style>
