<template>
    <div class="Prompt" v-if="Create">
        <h3>创建用户</h3>
        <form>
            <div class="flex input column">
                <div>账号:</div>
                <input type="text" class="flex-1 text" v-model.text="data.data.username">
                <div class="flex red" v-if="!username">账号不能超过17位或为空</div>
            </div>
            <div class="flex input column">
                <div>密码:</div>
                <input type="password" class="flex-1" v-model.text="data.data.password" placeholder="请输入密码"
                    autocomplete="off">
                <div class="flex red" v-if="!password">密码不能超过17位或为空</div>
            </div>
            <div class="flex input column">
                <div>昵称:</div>
                <input type="text" class="flex-1 text" v-model.text="data.data.nickname">
                <div class="flex red" v-if="!nickname">昵称不能超过17位或为空</div>
            </div>
            <div class="flex input column">
                <div>手机号码:</div>
                <input type="tel" class="flex-1 text" v-model.text="data.data.mobile">
                <div class="flex red" v-if="!mobile">电话输入错误</div>
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
                <input type="date" class="flex-1 text" v-model.date="data.data.expireDate">
                <div class="flex red" v-if="!time">请选择时间</div>
            </div>
            <div class="flex">
                <div class="cancel" @click="Createfun">取消</div>
                <div class="button" @click="Confirm">确定</div>
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
    } from 'vue';
    import Prompt from '../components/Prompt.vue';
    export default defineComponent({
        components: {
            Prompt,
        },
        props: {
            Create: Boolean
        },
        setup(props, ctx) {
            const { proxy } = getCurrentInstance();
            const Visiable = ref('')
            const Prompt = ref(false)
            const state = reactive({
                username: true,
                password: true,
                nickname: true,
                time: true,
                mobile: true,
                data: {
                    url: '/member',
                    data: {
                        username: '',
                        password: '',
                        nickname: '',
                        expireDate: '',
                        vip: false,
                        mobile:''
                    }
                }
            })
            const Createfun = () => {
                ctx.emit("Create_Switch");
            }
            const Confirm = () => {
                let Rules1 = /^\w{1,17}$/;
                let Rules2 = /^\d{4}-\d{1,2}-\d{1,2}/;
                let Rules3 = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
                state.username = Rules1.test(state.data.data.username)
                state.password = Rules1.test(state.data.data.password)
                state.nickname = Rules1.test(state.data.data.nickname)
                state.time = Rules2.test(state.data.data.expireDate)
                state.mobile=Rules3.test(state.data.data.mobile)
                if (state.username && state.password && state.nickname && state.time&&state.mobile) {
                    Prepare()
                    Createfun()
                }
            }
            const Prepare = () => {
                new Promise((resolve) => {
                    return resolve(proxy.$post(state.data))
                }).then((res) => {
                    let code = res.data.code
                    if (code == 0) {
                        Promptfun('成功创建用户')
                        Createfun()
                    }else{
                        Promptfun('失败创建用户')
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
            return {
                ...toRefs(state),
                Createfun,
                Confirm,
                Visiable,
                Prompt
            }
        }
    })
</script>
<style scoped>
    @import "../style/style.css";

    .Prompt {
        position: fixed;
        left: 50%;
        top: 100px;
        margin-left: -230px;
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
    h3{
        text-align: center;
    }
</style>