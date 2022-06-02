<template>
    <div class="flex column PlanManagement flex-1 ">
        <h4>主页 / 用户笔记 / 笔记详情</h4>
        <div class="flex flex-1 column ">
            <table class="column width flex-end status">
                <tr>
                    <th>计划编号: {{project.id}}</th>
                    <th>会员账号: {{project.username}}</th>
                    <th>计划类型: {{project.type}}</th>
                </tr>
                <tr>
                    <th>计划状态:{{project.status}}</th>
                    <th>中奖情况:{{project.winStatus}}</th>
                    <th>最后编辑时间: {{project.createTime}}</th>

                </tr>
            </table>
        </div>
        <h4>计划明细</h4>
        <table class="column width ">
            <thead>
                <tr class="Attribute">
                    <th>场次号</th>
                    <th>对阵</th>
                    <th>比赛时间</th>
                    <th>盘口</th>
                    <th>赔率</th>
                    <th>比分</th>
                    <th>比赛状态</th>
                    <th>中奖情况</th>
                </tr>
            </thead>
            <template v-for="(item, index) in rows" :key="index">
                <tr>
                    <td>{{item.matchId}}</td>
                    <td>{{item.game}} {{item.home}}vs{{item.away}}</td>
                    <td>{{item.matchTime}}</td>
                    <td>{{item.pan}}</td>
                    <td>{{item.odd}}</td>
                    <template v-if="item.homeScore">
                        <td>{{item.homeScore}}:{{item.awayScore}}</td>
                    </template>
                    <template v-else>
                        <td>未知</td>
                    </template>
                    <td>{{item.status}}</td>
                    <td>{{item.winStatus}}</td>

                </tr>
            </template>
        </table>
        <!-- <Create :Create="Create" @Create_Switch="Create_Switch"></Create> -->
        <!-- <Update :Updates="Updates" :user="user" @Update_Switch="Update_Switch"></Update> -->
        <Prompt :Prompt="Prompt" :Visiable="Visiable"></Prompt>
    </div>
</template>
<script>
    import {
        ref,
        watch,
        toRefs,
        reactive,
        defineComponent,
        getCurrentInstance,
    } from 'vue';
    import {
        CloseCircleTwoTone,
        CheckCircleTwoTone,
        SettingTwoTone,
        LeftOutlined,
        RightOutlined,
    } from '@ant-design/icons-vue';
    import Prompt from '../components/Prompt.vue';
    import DropDownBox from '../components/DropDownBox.vue';
    // import Update from '../components/Update.vue';
    import { useRouter, useRoute } from "vue-router";
    export default defineComponent({
        components: {
            Prompt,
            // Create,
            // Update,
            CloseCircleTwoTone,
            CheckCircleTwoTone,
            SettingTwoTone,
            LeftOutlined,
            RightOutlined,
            DropDownBox
        },
        setup() {
            const { proxy } = getCurrentInstance();
            const router = useRouter();
            const route = useRoute().query;
            const Visiable = ref('')
            const Prompt = ref(false)
            const DropDownBox = ref()
            const state = reactive({
                data: {
                    url: '/project/football',
                    data: {
                    }
                },
                rows: [],
                page: 1,
                pageSize: 10,
                statusVal: '',
                type: '',
                Create: '',
                project: [],
                model: [],
                follow: [],
                DropDownBoxValue: 0
            })
            const Prepare = (eve) => {
                state.data.url = '/notes/' + route.id
                new Promise((resolve) => {
                    return resolve(proxy.$get(state.data))
                }).then((res) => {
                    if (res.data.code == 0) {
                        state.rows = res.data.data.notes
                        state.project=res.data.data.project
                        state.project.username=state.rows[0].username
                        // common_model()//测试
                    } else {
                        Promptfun(res.data.data)
                    }

                }).catch((err) => {

                })
            }
            const list = (eve) => {
                let arr = []
                let total = state.total - 5
                if (state.total < 5) {
                    for (let index = 0; index < state.total; index++) {
                        arr[index] = index + 1;
                    }
                } else if (eve < 3) {
                    for (let index = 0; index < 5; index++) {
                        arr[index] = index + 1;
                    }
                } else if (eve > state.total - 2) {
                    for (let index = 0; index < 5; index++) {
                        arr[index] = total - index;
                    }
                } else {
                    for (let index = 0; index < 5; index++) {
                        arr[index] = eve - 2 + index;
                    }
                }
                return arr
            }
            const common_model = () => {
                let data = {
                    url: "/project/football"
                }
                new Promise((resolve) => {
                    return resolve(proxy.$get(data))
                }).then((res) => {
                    if (res.data.code == 0) {
                        state.model = res.data.data.rows
                    } else {
                        Promptfun(res.data.data)
                    }

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
            const Promptfun = (eve) => {//提示
                Visiable.value = eve
                Prompt.value = true
                setTimeout(function () {
                    Prompt.value = false
                    localStorage.removeItem("Backstage_Token");
                    router.push("/login");
                }, 1000)
            }
            const check = (eve) => {//查看
                router.push("/Details?id=" + eve.id);
            }
            const Queryfun = () => {//查询
                Prepare(true)
            }
            const Reset = () => {//重置
                state.DropDownBoxValue += 1
                state.Query.model = ''
                state.Query.winstatus = ''
                state.Query.project = ''
                state.Query.Query = ''
            }
            const jump=(path,id)=>{
                router.push({
                    path: path,
                    query: {
                        id:id
                    },
                });
            }
            return {
                ...toRefs(state),
                Prepare,
                Visiable,
                Prompt,
                left,
                right,
                button_page,
                check,
                Queryfun,
                Reset,
                route,
                jump
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
    input {
        height: 25px;
        margin-left: 5px;
    }

    .PlanManagement {
        padding: 45px 5% 0;
        flex-grow: 1;
    }

    .width {
        width: 100%;
    }

    .Search {
        margin: 5px;
        font-size: 1rem;

    }

    .Search .row {
        margin: 5px 10px;
    }

    .Search .row input {
        border-radius: 5px;
        border: 0.75px solid rgb(105, 105, 105);
    }

    .button {
        margin: 0 10px;
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

    .buttonlist .button_page {
        padding: 8px 8px;

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

    .active {
        border: 0.75px #42A5F5 solid;
    }

    .status th {
        text-align: inherit;
        border: none;
    }

    h4 {
        margin: 7px 0;
    }
</style>