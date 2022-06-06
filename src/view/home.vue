<template>
    <div class="list flex column ">
        <h4>主页 / 会员管理</h4>
        <div class="button content flex" @click="Create_Switch">创建用户 </div>
        <table class="column width ">
            <thead>
                <tr class="Attribute">
                    <th>用户ID</th>
                    <th>手机号码</th>
                    <th>账号</th>
                    <th>昵称</th>
                    <th>头像</th>
                    <th>vip过期时间</th>
                    <th>注册时间</th>
                    <th>VIP</th>
                    <th>状态</th>
                    <th>编辑</th>
                </tr>
            </thead>
            <template v-for="(item, index) in rows" :key="index">
                <tr>
                    <td>{{item.id}}</td>
                    <td>{{item.mobile}}</td>
                    <td>{{item.username}}</td>
                    <td>{{item.nickname}}</td>
                    <td>{{item.avatar}}</td>
                    <td>{{item.expireDate}}</td>
                    <td>{{item.regDate}}</td>
                    <td>
                        <check-circle-two-tone two-tone-color="#42A5F5" v-if="item.vip" />
                        <close-circle-two-tone two-tone-color="#E53935" v-else />
                    </td>
                    <td @click="status(index)">
                        <check-circle-two-tone two-tone-color="#42A5F5" v-if="item.enable" />
                        <close-circle-two-tone two-tone-color="#E53935" v-else />
                    </td>
                    <td @click="Update_open(item)">
                        <setting-two-tone />
                    </td>
                </tr>
            </template>
        </table>

        <div class="flex flex-end width">
            <div class="flex buttonlist">
                <div class="left button_page align" @click="left">
                    <left-outlined />
                </div>
                <template v-for="(item, index) in total_list" :key="index">
                    <div v-if="item=='...'">
                        <p>
                            ...
                        </p>
                    </div>
                    <div class="button_page align" :class="item==page?'active':''" @click="button_page(item)" v-else>
                        {{item}}
                    </div>
                </template>
                <div class="right button_page align" @click="right">
                    <right-outlined />
                </div>
            </div>
        </div>
        <Create :Create="Create" @Create_Switch="Create_Switch"></Create>
        <Update :Updates="Updates" :user="user" @Update_Switch="Update_Switch"></Update>
        <Prompt :Prompt="Prompt" :Visiable="Visiable"></Prompt>
    </div>
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
    import Create from '../components/Create.vue';
    import Update from '../components/Update.vue';
    import { useRouter } from "vue-router";
    import {
        CloseCircleTwoTone,
        CheckCircleTwoTone,
        SettingTwoTone,
        LeftOutlined,
        RightOutlined,
    } from '@ant-design/icons-vue';
    export default defineComponent({
        components: {
            Prompt,
            Create,
            Update,
            CloseCircleTwoTone,
            CheckCircleTwoTone,
            SettingTwoTone,
            LeftOutlined,
            RightOutlined,
        },
        setup() {
            const { proxy } = getCurrentInstance();
            const router = useRouter();
            const Visiable = ref('')
            const Prompt = ref(false)
            const page = ref(0)
            const title = "用户后台";
            const url = '/'
            const state = reactive({
                data: {//数据获取路径
                    url: '/member?page=1&pageSize=10',
                    data: {}
                },
                rows: [],
                page: 1,
                pageSize: 10,
                total: 3,
                T_Status: false,
                total_list: [],
                Create: false,
                Updates: false,
                user: ''
            })
            const Promptfun = (eve) => {
                Visiable.value = eve
                Prompt.value = true
                setTimeout(function () {
                    Prompt.value = false
                    localStorage.removeItem("Backstage_Token");
                    router.push("/login");
                }, 1000)
            }
            const Success = (eve) => {
                Visiable.value = eve
                Prompt.value = true
                Prepare()
                setTimeout(function () {
                    Prompt.value = false
                }, 1000)
            }
            const Prepare = () => {//数据获取
                state.data.url = '/member?page=' + state.page + '&pageSize=' + state.pageSize
                new Promise((resolve) => {
                    return resolve(proxy.$get(state.data))
                }).then((res) => {
                    console.log(res);
                    if (res.data.code == 1) {
                        console.log(res.data);
                        Promptfun(res.data.data)
                    }
                    state.rows = res.data.data.rows
                    state.total = Math.ceil(res.data.data.total / 10)
                    state.total_list = list(state.page)
                }).catch((err) => {

                })
            }
            const right = () => {
                if (state.total > state.page) {
                    state.page += 1
                }
                Prepare()
            }
            const left = () => {
                if (state.page > 1) {
                    state.page -= 1
                }
                Prepare()
            }
            const button_page = (eve) => {
                console.log(eve)
                state.page = eve
                Prepare()
            }
            const list = (eve) => {
                let pageList = [];
                let total = state.total
                let pagerCount = 5
                let current = eve
                //如果总页数在可显示页码数量以内，全部显示
                if (pagerCount > total - 1) {
                    for (let i = 1; i <= total; i++) {
                        pageList.push(i);
                    }
                } else {//如果总页数超过可显示页码数量，根据不同情况显示
                    //当前页能连到开始
                    if (current < pagerCount - 1) {
                        for (let i = 1; i < pagerCount; i++) {
                            pageList.push(i);
                        }
                        pageList.push('...');
                        pageList.push(total);
                    } else {
                        //当前页能连到结束
                        if (current >= total - 1 - Math.floor(pagerCount / 2)) {
                            pageList.push(1);
                            pageList.push('...');
                            for (
                                let i = total - (pagerCount - 2);
                                i <= total;
                                i++
                            ) {
                                pageList.push(i);
                            }
                        } else {
                            //当前页不能连到结束
                            pageList.push(1);
                            pageList.push('...');
                            for (
                                let i = current - Math.floor((pagerCount - 2) / 2);
                                i <= current + (Math.ceil((pagerCount - 2) / 2) - 1);
                                i++
                            ) {
                                pageList.push(i);
                            }
                            pageList.push('...');
                            pageList.push(total);
                        }
                    }
                }
                return pageList;
            }
            const totalclick = () => {
                state.T_Status = !state.T_Status
            }
            const Create_Switch = () => {
                Prepare()
                state.Create = !state.Create
            }
            const status = (eve) => {//更新状态
                let data = {
                    url: '/member/' + state.rows[eve].id + '/switch',
                    data: {
                        enable: !state.rows[eve].enable
                    }
                }
                new Promise((resolve) => {
                    return resolve(proxy.$put(data))
                }).then((res) => {
                    if (res.data.code == 0) {
                        Success('更新状态成功')
                    } else {
                        console.log(res);
                        Promptfun('更新状态失败')
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }
            const time_sw = (date) => {
                let nowdate = new Date(date).toLocaleDateString().replace(/\//g, '-')
                return nowdate
            }
            const Update_Switch = () => {
                state.Updates = false
                Prepare()
            }
            const Update_open = (eve) => {
                state.Updates = true
                state.user = JSON.parse(JSON.stringify(eve));
                state.user.expireDate = time_sw(eve.expireDate)
            }
            return {
                ...toRefs(state),
                Prepare,
                Visiable,
                Prompt,
                title,
                left,
                right,
                totalclick,
                Create_Switch,
                status,
                Update,
                Update_Switch,
                Update_open,
                button_page
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.Prepare()
            })
        },
    })
</script>
<style scoped>
    html,
    body,
    h1,
    h2,
    h3,
    h5,
    h6,
    p,
    blockquote {
        margin: 0;
        padding: 0;
        font-weight: normal;
        -webkit-font-smoothing: antialiased;
    }

    .list {
        /* width: 100%; */
        padding: 45px 5% 0;
        flex-grow: 1;
    }

    .width {
        width: 100%;

    }

    table {
        width: 80%;
    }

    body>table {
        margin-left: 30px;
    }

    @media print {

        body,
        code,
        pre code,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            color: black;
        }

        table,
        pre {
            page-break-inside: avoid;
        }
    }

    hr {
        margin: 0 0 19px;
        border: 0;
        border-bottom: 1px solid #ccc;
    }

    table {
        margin: 10px 0 15px 0;
        border-collapse: collapse;
    }

    td,
    th {
        border: 1px solid #ddd;
        padding: 15px 10px;
        text-align: center;
        border-right: none;
        border-left: none;
    }
    .button_page {
        padding: 8px 10px;
        border: 0.75px #ddd solid;
        margin: 1px;
        display: flex;
    }

    .button_page:hover {
        border: 0.75px #42A5F5 solid;
    }

    .button_page:active {
        border: 0.75px #42A5F5 solid;
        background-color: #cfe4f5;
    }

    .left {
        border-radius: 15px 0 0 15px;
    }

    .right {
        border-radius: 0 15px 15px 0;
    }

    .city {
        border: 0.75px #ddd solid;
        border-radius: 0 0 15px 15px;
        margin: 1px;
        list-style: none;
        padding: 0;
        text-align: center;
        position: absolute;
        top: 40px;
        left: 0;
    }

    .page {
        position: relative;
    }

    .flex p {
        padding: 8px 10px;
    }

    li {
        padding: 8px 10px;
    }

    li:hover {
        background-color: #cfe4f5;
    }

    li:active {
        background-color: #99cffc;
    }

    .active {
        border: 0.75px #42A5F5 solid;
    }
</style>