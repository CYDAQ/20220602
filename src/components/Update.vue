<template>
    <div class="Updates" v-if="Updates">
        <h3>编辑用户</h3>
        <form>
            <!-- <div class="flex input column">
                <div>账号:</div>
                <input type="text" class="flex-1 text" v-model.text="data.data.username">
                <div class="flex red" v-if="!username">账号不能超过17位或为空</div>
            </div> -->

            <div class="flex input column">
                <div>昵称:</div>
                <input type="text" class="flex-1 text" v-model.text="data.data.nickname">
                <div class="flex red" v-if="!nickname">昵称不能超过17位或为空</div>
            </div>
            <div class="flex input column">
                <div>手机号码:</div>
                <input type="tel" class="flex-1 text" v-model.text="data.data.mobile">
                <div class="flex red" v-if="!mobile">请重新输入手机号码</div>
            </div>
            <div class="flex input align">
                <div>vip:</div>
                <input type="radio" name="vip" v-model='data.data.vip' value=true>开启
                <input type="radio" name="vip" v-model='data.data.vip' value=false>关闭
            </div>
            <!-- <div class="flex input">
                <div>头像:</div>
            </div> -->
            <div class="flex input column">
                <div>会员过期时间:</div>
                <input type="date" class="flex-1 text" v-model="data.data.expireDate">
                <div class="flex red" v-if="!expireDate">请选择时间 </div>
            </div>
            <div class="flex">
                <div class="cancel" style="margin-right: 40px" @click="Updatefun">取消</div>
                <div class="button" @click="Confirm">修改</div>
            </div>
            <div class="flex input column">
                <div>重置密码:</div>
                <input type="password" class="flex-1" v-model.text="password2" placeholder="重置密码"
                    autocomplete="off">
                <div class="flex red" v-if="!password">密码不能超过17位或为空</div>
            </div>
            <div>
                <div class="button" @click="password_Confirm">仅修改密码</div>
            </div>
        </form>
    </div>
    <Prompt :Prompt="Prompt" :Visiable="Visiable"></Prompt>

</template>
<script>
    import {
        ref,
        toRefs,
        reactive,
        defineComponent,
        getCurrentInstance,
        watch,
    } from 'vue';
    import Prompt from '../components/Prompt.vue';
    export default defineComponent({
        components: {
            Prompt,
        },
        props: {
            user: {
                default: false
            },
            Updates: Boolean
        },
        setup(props, ctx) {
            const { proxy } = getCurrentInstance();
            const Visiable = ref('')
            const Prompt = ref(false)
            const state = reactive({
                username: true,
                password: true,
                password2: '',
                nickname: true,
                expireDate: true,
                mobile: true,
                time:'2022-6-5',
                data: {
                    url: '/member/',
                    data: {
                        username: '',
                        nickname: '',
                        expireDate: "",
                        vip: false,
                        mobile: ''
                    }
                }
            })
            const Updatefun = () => {
                state.username = true
                state.password = true
                state.nickname = true
                state.expireDate = true
                state.mobile = true
                state.data.data.username=''
                state.data.data.password=''
                state.data.data.nickname=''
                state.data.data.expireDate=''
                state.data.data.mobile=''
                ctx.emit("Update_Switch");
            }
            const password_Confirm = () => {
                let Rules1 = /^\w{1,17}$/;
                state.password = Rules1.test(state.password2)
                if (state.password) {
                    password_Prepare()
                }
            }
            const Confirm = () => {
                //规则
                let Rules1 = /^\w{1,17}$/;
                let Rules2 = /^\d{4}-\d{1,2}-\d{1,2}/;
                let Rules3 = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
                // 判断
                // state.username = Rules1.test(state.data.data.username)
                // state.expireDate = Rules2.test(state.data.data.expireDate)
                // state.mobile = Rules3.test(state.data.data.mobile)
                if (state.data.data.nickname == '') {
                    state.nickname = false
                } else {
                    state.nickname = true
                }
                if (state.nickname && state.expireDate && state.mobile) {
                    Prepare()
                }
                Prepare()
            }
            const password_Prepare = () => {
                let data = {
                    url: "/member/" + state.data.data.id + "/resetpwd",
                    data: {
                        password: state.password2
                    }
                }
                new Promise((resolve) => {
                    return resolve(proxy.$put(data))
                }).then((res) => {
                    let code = res.data.code
                    if (code == 0) {
                        Promptfun('成功')
                    } else {
                        Promptfun('失败')
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }
            const Prepare = () => {
                state.data.url = '/member/' + state.data.data.id
                new Promise((resolve) => {
                    return resolve(proxy.$put(state.data))
                }).then((res) => {
                    let code = res.data.code
                    if (code == 0) {
                        Promptfun('成功')
                    } else {
                        Promptfun('失败')
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }
            const Promptfun = (eve) => {
                Visiable.value = eve
                Prompt.value = true
                setTimeout(function () {
                    Prompt.value = false
                }, 1000)
            }
            const time_sw = (date) => {
                let nowdate = new Date(date).toLocaleDateString().replace(/\//g, '-')
                return nowdate
            }
            return {
                ...toRefs(state),
                Updatefun,
                Confirm,
                Visiable,
                Prompt,
                password_Confirm
            }
        },

        data() {
            return {
                conData: this.user
            }
        },
        watch: {
            user: function (val) {
                this.conData = val
            },
            conData: function (val) {//监听数据是否修改
                this.data.data = this.conData
                console.log( this.data.data.expireDate);
                delete this.data.data.password
            }
        },

    })
</script>
<style scoped>
    @import "../style/style.css";

    .Updates {
        position: fixed;
        left: 50%;
        top: 100px;
        margin-left: -260px;
        padding: 80px;
        background-color: rgb(255, 255, 255);
        border-radius: 15px;
        z-index: 9999;
        box-shadow: 1px 1px 10px rgba(190, 190, 190, 0.4);
    }

    .input {
        margin: 20px;
    }

    input {
        padding: 10px;
        border: 0.75px #bbb solid;
        border-radius: 10px;
        display: flex;
    }

    .red {
        color: #E53935;
    }

    h3 {
        text-align: center;
    }
</style>