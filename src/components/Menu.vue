<template>
    <pageNavs :title="title" :route="routes"></pageNavs>
    <div class=" row flex" style="height: 100%;">
        <div class="menu" v-if="login">
            <table>
                <ul :class="calss=='会员管理' ? 'Select' : 'ul'" @click="jump('/home')">
                    <li>会员管理</li>
                </ul>
                <ul :class="calss=='计划管理' ? 'Select' : 'ul'" @click="jump('/PlanManagement')">
                    <li>计划管理</li>
                </ul>
                <ul :class="calss=='用户笔记' ? 'Select' : 'ul'" @click="jump('/UserNotes')">
                    <li>用户笔记</li>
                </ul>
            </table>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import pageNavs from '../components/pageNavs.vue';
    import { useRoute, useRouter } from "vue-router";
    import {
        ref,
        watch,
        toRefs,
        reactive,
        defineComponent,
        getCurrentInstance,
    } from 'vue';

    export default {
        components: {
            pageNavs
        },

        setup() {
            const router = useRouter()
            const route = useRoute()
            const currentPath = ref(`${route.path}`)
            const state = reactive({
                title: '收米笔记',
                calss: '',
                login: true,
                routes:currentPath.value,
            })
            const Position = () => {
                if (currentPath.value == '/login') {
                    state.login = false
                    return
                } else {
                    state.login = true
                }
                switch (currentPath.value) {
                    case '/home':
                        state.calss = '会员管理'
                        break;
                    case '/PlanManagement':
                        state.calss = '计划管理'
                        break;
                    case '/UserNotes':
                        state.calss = '用户笔记'
                        break;
                    default:
                        break;
                }
            }
            watch(() => route.path, () => {
                currentPath.value = route.path
                Position()
            })
            const jump = (path) => {
                router.push({
                    path: path,
                    query: {
                    },
                });
            }
            return {
                ...toRefs(state),
                Position,
                jump,
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.Position()
            })
        },
    }
</script>
<style scoped>
    .menu {
        width: 13%;
    }

    td,
    tr,
    table {
        width: 100%;
        padding-top: 50px;
    }

    td {
        padding: 15px;
        background-color: #42A5F5;
        color: #fff;
        border-radius: 10px;
    }

    li {
        list-style: none;
        padding: 15px 45px;
        border-radius: 15px;
    }

    .ul {
        margin: 0;
        border-radius: 15px;
        padding: 0;
    }

    .ul:hover {
        background-color: #E1F5FE;
        color: #000;
    }

    .ul:active {
        background-color: #81D4FA;
        color: #fff;
    }

    .Select {
        padding: 0;
        margin: 0;
        border-radius: 15px;
        background-color: #42A5F5;
        color: #fff;
    }
</style>