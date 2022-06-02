import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/view/login.vue'
import homeView from '@/view/home.vue'
import UserNotesView from '@/view/UserNotes.vue'
import PlanManagementView from '@/view/PlanManagement.vue'
import DetailsView from '@/view/Details.vue'
import NotesView from '@/view/Notes.vue'
const routes = [
    {
        path: '/login',
        name: '登录页',
        component: LoginView
    },
    {
        path: '/home',
        name: 'home',
        component: homeView
    },
    {
        path: '/UserNotes',
        name: 'UserNotes',
        component: UserNotesView
    },
    {
        path: '/PlanManagement',
        name: 'PlanManagement',
        component: PlanManagementView
    },
    {
        path: '/Notes',
        name: 'Notes',
        component: NotesView
    },
    {
        path: '/Details',
        name: 'Details',
        component: DetailsView
    },
    { path: '/', redirect: '/home' },
]
const whiteList = ['/login']
let router = createRouter({
    routes,
    history: createWebHistory(),
})
router.beforeEach((to, from, next) => {
    whiteList.forEach(function (item) {
        if (item.indexOf(to.path) !== -1) {
            next()
            return
        }
    });
    let token = localStorage.getItem('Backstage_Token')
    if (token) {
        next()
    } else {
        next({ path: '/login' })
    }
})
export default router;