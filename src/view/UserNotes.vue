<template>
    <div class="flex column PlanManagement flex-1 ">
        <h4>主页 / 用户笔记</h4>
        <div class="flex flex-1 column">
            <table class="column width ">
                <thead>
                    <tr class="Attribute">
                        <td>笔记编号:<input type="text" v-model="Query.projectId" class="input"></td>
                        <!-- <td>计划编号:<input type="text" v-model="Query.keywords" class="input"></td> -->
                        <td>会员账号:<input type="text" v-model="Query.username" class="input"></td>
                    </tr>
                    <tr class="Attribute align">
                        <td>
                            <div class="row flex align flex-center">
                                模型类型:
                                <DropDownBox :value="DropDownBoxValue" :list="model" class="DropDownBox"
                                    @DropDownBox="modelfun">
                                </DropDownBox>
                            </div>
                        </td>
                        <td>
                            <div class="row flex align flex-center">
                                计划状态: <DropDownBox :value="DropDownBoxValue" :list="project" class="DropDownBox"
                                    @DropDownBox="projectfun">
                                </DropDownBox>
                            </div>
                        </td>
                        <td>
                            <div class="row flex align flex-center">
                                中奖状态: <DropDownBox :value="DropDownBoxValue" :list="winstatus" class="DropDownBox"
                                    @DropDownBox="winstatusfun">
                                </DropDownBox>
                            </div>
                        </td>
                    </tr>
                </thead>
            </table>
            <div class="flex flex-1 row Search end">
                <button class="button " @click="Queryfun">查询</button>
                <button class="button " @click="Reset">重置</button>
            </div>
        </div>
        <table class="column width ">
            <thead>
                <tr class="Attribute">
                    <th>序号</th>
                    <th>计划编号</th>
                    <th>笔记编号</th>
                    <th>会员账号</th>
                    <th>模型类型</th>
                    <th>计划状态</th>
                    <th>中奖状态</th>
                    <!-- <th>奖金</th> -->
                    <th>最后编辑时间</th>
                    <th>编辑</th>
                </tr>
            </thead>
            <template v-for="(item, index) in rows" :key="index">
                <tr>
                    <td>{{index+1}}</td>
                    <td>{{item.projectId}}</td>
                    <td>{{item.followId}}</td>
                    <td>{{item.username}}</td>
                    <td>{{item.modelType}}</td>
                    <td>{{item.status}}</td>
                    <td>{{item.winStatus}}</td>
                    <td>{{item.createTime}}</td>
                    <td class="">
                        <a href="#" @click="jump('/Notes' ,item)">查看</a>
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
                    <div class="button_page" @click="button_page(item)" :class="item==page?'active':''">
                        {{item}}
                    </div>
                </template>
                <div class="right button_page align" @click="right">
                    <right-outlined />
                </div>
            </div>
        </div>
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
    import { useRouter } from "vue-router";
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
                winStatusVal: '',
                statusVal: '',
                type: '',
                Create: '',
                total_list: [],
                model: [],
                winstatus: [],
                project: [],
                Query: {
                    type: '',
                    winStatusVal: '',
                    statusVal: '',
                    username: '',
                    projectId: ''
                },
                DropDownBoxValue: 0
            })
            const Prepare = (eve) => {
                if (eve) {
                    state.data.url = eve
                } else {
                    state.data.url = '/follow?page=' + state.page + '&pageSize=' + state.pageSize
                }
                new Promise((resolve) => {
                    return resolve(proxy.$get(state.data))
                }).then((res) => {
                    if (res.data.code == 0) {
                        state.rows = res.data.data.rows
                        state.total = Math.ceil(res.data.data.total / 10)
                        state.total_list = list(state.page)
                        common_model()
                        CommonProjectStatus()
                        commonProjectWinstatus()
                    } else {
                        Promptfun(res.data.data)
                    }
                }).catch((err) => {
                })
            }
            const list = (eve) => {
                let pageList = [];
                let total = state.total
                let pagerCount = 5
                let current = state.page
                //如果总页数在可显示页码数量以内，全部显示
                if (pagerCount > total - 1) {
                    for (let i = 1; i <= total; i++) {
                        pageList.push(i);
                    }
                } else {
                    //如果总页数超过可显示页码数量，根据不同情况显示
                    //当前页能连到开始
                    if (current < pagerCount - 1) {
                        for (let i = 1; i < pagerCount; i++) {
                            pageList.push(i);
                        }
                        pageList.push('next');
                        pageList.push(total);
                    } else {
                        //当前页能连到结束
                        if (current >= total - 1 - Math.floor(pagerCount / 2)) {
                            pageList.push(1);
                            pageList.push('prev');
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
                            pageList.push('prev');

                            for (
                                let i = current - Math.floor((pagerCount - 2) / 2);
                                i <=
                                current + (Math.ceil((pagerCount - 2) / 2) - 1);
                                i++
                            ) {
                                pageList.push(i);
                            }

                            pageList.push('next');
                            pageList.push(total);
                        }
                    }
                }
                return pageList;
            }
            const common_model = () => {
                let data = {
                    url: "/common/model"
                }
                new Promise((resolve) => {
                    return resolve(proxy.$get(data))
                }).then((res) => {
                    if (res.data.code == 0) {
                        state.model = res.data.data
                    } else {
                        Promptfun(res.data.data)
                    }

                }).catch((err) => {

                })
            }
            const commonProjectWinstatus = () => {
                let data = {
                    url: "/common/project/winstatus"
                }
                new Promise((resolve) => {
                    return resolve(proxy.$get(data))
                }).then((res) => {
                    if (res.data.code == 0) {
                        state.winstatus = res.data.data
                    } else {
                        Promptfun(res.data.data)
                    }

                }).catch((err) => {

                })
            }
            const CommonProjectStatus = () => {
                let data = {
                    url: "/common/project/status"
                }
                new Promise((resolve) => {
                    return resolve(proxy.$get(data))
                }).then((res) => {
                    if (res.data.code == 0) {
                        state.project = res.data.data
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
                router.push({
                    path: '/Details',
                    query: {
                        id: eve.id,
                    },
                });
            }
            const modelfun = (eve) => {//接收DropDownBox组件值
                state.Query.type = eve
            }
            const winstatusfun = (eve) => {
                state.Query.winStatusVal = eve
            }
            const projectfun = (eve) => {
                state.Query.statusVal = eve
            }
            const Queryfun = () => {//查询
                let url = ref('/follow?page=' + state.page + '&pageSize=' + state.pageSize)
                if (state.Query.username !== '') {
                    url.value = url.value + '&username=' + state.Query.username
                }
                if (state.Query.projectId !== '') {
                    url.value = url.value + '&projectId=' + state.Query.projectId
                }
                if (state.Query.type !== '') {
                    url.value = url.value + '&modelType=' + state.Query.type
                }
                if (state.Query.winStatusVal !== '') {
                    url.value = url.value + '&winStatusVal=' + state.Query.winStatusVal
                }
                if (state.Query.statusVal !== '') {
                    url.value = url.value + '&statusVal=' + state.Query.statusVal
                }
                Prepare(url.value)
                state.DropDownBoxValue += 1
                state.Query.type = ''
                state.Query.winStatusVal = ''
                state.Query.statusVal = ''
                state.Query.username = ''
                state.Query.projectId = ''
            }
            const Reset = () => {//重置
                state.DropDownBoxValue += 1
                state.Query.model = ''
                state.Query.winstatus = ''
                state.Query.project = ''
                state.Query.Query = ''
                Prepare()
            }
            const jump = (path, id) => {
                router.push({
                    path: path,
                    query: {
                        id: id.followId,
                        createTime: id.createTime,
                        modelType: id.modelType,
                        username: id.username,
                        status: id.status,
                        winStatus: id.winStatus
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
                modelfun,
                projectfun,
                winstatusfun,
                check,
                Queryfun,
                Reset,
                DropDownBox,
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
        font-size: 0.9rem;

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

    .input {
        height: 25px;
        border-radius: 5px;
        border: 0.75px solid #696969;
        width: 170px;
    }

    .select {
        display: flex;
    }

    .DropDownBox {
        height: 25px;
        margin-left: 5px;
    }

    .status th,
    td {
        border: none;
        padding: 10px;
    }

    td a {
        color: #42A5F5;
        text-decoration: none;
    }

    td a:active {
        color: #1c8dea;
    }

    td a:hover {
        color: #375f7f;
        text-decoration: revert;
    }
</style>