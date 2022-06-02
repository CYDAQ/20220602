<template>
    <nav class="navbar navbar-light bg-light flex">
        <div class="container-fluid flex-row flex-1 flex">
            <div class="flex-1 text">
                <h3>{{title}}</h3>
            </div>
        </div>
        <input type="text" class="username" :value="username" readonly="readonly" @click="exit" @blur="Close"
            v-if="login">
        <div class="card" v-if="visibility">
            <input type="text" class="txt" value="退出登录" readonly="readonly" @click="Log_out">
        </div>
    </nav>
    <Prompt :Prompt="Prompt" :Visiable="Visiable"></Prompt>
</template>
<script>
    import Prompt from '../components/Prompt.vue';
    import { useRouter, useRoute } from "vue-router";
    import { ref, watch, reactive, toRefs } from 'vue';
    export default {
        props: {
            title: String,
            url: String,
            route: String,
        },
        components: {
            Prompt,
        },
        setup(props) {
            const username = ref(localStorage.getItem("Backstage_user"))
            const visibility = ref(false)
            const Visiable = ref('')
            const Prompt = ref(false)
            const router = useRouter();
            const route = useRoute()
            const currentPath = ref(`${route.path}`)
            const state = reactive({
                login: true,
            })
            const exit = () => {
                visibility.value = !visibility.value
            }
            const Close = () => {
                setTimeout(function () {
                    visibility.value = false
                }, 500)
            }
            const Promptfun = (eve) => {//提示
                Visiable.value = eve
                Prompt.value = true
                setTimeout(function () {
                    Prompt.value = false
                    username.value = ''
                    localStorage.removeItem("Backstage_Token");
                    localStorage.removeItem("Backstage_user");
                    router.push("/login");
                }, 1000)
            }
            const Log_out = () => {
                Promptfun('已退出登录')
            }
            watch(() => route.path, () => {
                if (route.path == '/login') {
                    state.login=false
                    username.value=''
                    return
                }else{
                    state.login=true
                    username.value = localStorage.getItem("Backstage_user")
                }


            })
            return {
                ...toRefs(state),
                username,
                visibility,
                exit,
                Close,
                Visiable,
                Prompt,
                Log_out
            }
        }
    }
</script>
<style scoped>
    @import "../style/style.css";

    .navbar {
        background-color: #373737;
        color: #fff;
    }

    h3 {
        padding-left: 68px;
        font-size: 1.5rem;
        font-weight: 500;
        margin: 20px 0;
    }

    .username {
        padding: auto;
        margin: auto;
        padding-right: 68px;
        border: none;
        background: none;
        color: #fff;
        font-size: 1rem;
        text-align: center;
        outline: none;
    }

    .txt {
        position: absolute;
        top: 60px;
        left: -160px;
        border-radius: 10px;
        border: 1px solid #000;
        padding: 10px 20px;
        color: #000;
        background-color: #fff;
    }

    .txt:hover {
        background-color: #42A5F5;
        color: #fff;
        border: 1px solid #fff;
    }

    .txt:active {
        background-color: #1E88E5;
        color: #fff;
        border: 1px solid #fff;
    }

    .card {
        position: relative;
        top: 0;
        left: 0;
    }
</style>