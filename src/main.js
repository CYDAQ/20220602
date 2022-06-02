import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import './style/style.css'
import request from './components/Request'

const app = createApp(App);
app.use(router)

app.config.globalProperties.$post = (eve) => {
    return request.post(eve)
}
app.config.globalProperties.$get = (eve) => {
    return request.get(eve)
}
app.config.globalProperties.$put = (eve) => {
    return request.put(eve)
}
app.mount('#app');
//APP.vue
//在app.vue内注册


