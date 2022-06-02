<template>
    <div>
        <div class="card row">
            <div class="flex flex-1 column login">
                <div class="Popover Input center">
                    <h1>
                        后台登录
                    </h1>
                </div>
                <div class="Input ">
                    <p>用户名:</p>
                    <input type="text" name="user" id="" class="input-radius1" v-model="data.data.username">
                </div>
                <div class="Input ">
                    <p>密码:</p>
                    <form @submit="Prepare" method="get">
                        <input type="password" placeholder="" name="" id="password" autocomplete="off"
                            v-model="data.data.password" class="input-radius2">
                    </form>
                </div>
                <div>
                    <button class="button center" @click="Prepare"> 确定</button>
                </div>
            </div>
        </div>
        <iframe id="id_iframe" name="nm_iframe" style="display:none;"></iframe>
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
    import { useRouter } from "vue-router";
    export default defineComponent({
        components: {
            Prompt,
        },
        setup() {
            const { proxy } = getCurrentInstance();
            const router = useRouter();
            const Visiable = ref('')
            const Prompt = ref(false)
            const state = reactive({
                data: {
                    url: '/login',
                    data: {
                        username: '',
                        password: ''
                    }
                }
            })
            const Promptfun = (eve) => {
                Visiable.value = eve
                Prompt.value = true
                setTimeout(function () {
                    Prompt.value = false
                    router.push("/home");
                }, 1000)
            }
            const Prepare = () => {
                new Promise((resolve) => {
                    return resolve(proxy.$post(state.data))
                }).then((res) => {
                    let code = res.data.code
                    if (code == 0) {
                        localStorage.setItem("Backstage_Token", res.data.data.token)
                        localStorage.setItem("Backstage_user", state.data.data.username)
                        Promptfun('登录成功')
                    } else {
                        localStorage.removeItem("Backstage_Token");
                        Promptfun('登录失败')
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }
            return {
                ...toRefs(state),
                Prepare,
                Visiable,
                Prompt
            }
        },
        mounted() {
            this.$nextTick(function () {
            })
        },
        methods: {
        }
    })
</script>
<style scoped>
    .card {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -300px;
        margin-top: -350px;
        width: 400px;
        padding: 100px;
        box-shadow: 5px 5px 10px #babecc, -5px -5px 10px rgb(242, 242, 242);
        display: inline-flex;
    }

    .login {
        padding: 15px;
    }

    .Input {
        width: 100%;
        margin-bottom: 15px;
    }

    .Input p {
        color: #BDBDBD
    }

    input {
        width: 100%;
        height: 30px;
        padding: 0;
        border: 0px;
        border-bottom: 1px solid #BDBDBD;
    }

    .button {
        width: 100%;
        padding: 10px 0;
        background-color: #64B5F6;
        border-radius: 15px;
        color: #fff;
    }

    .button:active {
        background-color: #64b4f673;
    }
</style>