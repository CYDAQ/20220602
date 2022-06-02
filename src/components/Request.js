import Qs from 'qs'
const axios = require('axios');
// axios.defaults.baseURL = 'http://192.168.2.7:8092/';//测试环境
axios.defaults.baseURL = 'http://bossapi.shoumi310.com/';//正式环境
const Request = {
    post(data) {
        let token = localStorage.getItem("Backstage_Token")
        return new Promise((resolve) => {
            axios({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: token
                },
                method: 'post',
                url: data.url,
                data: Qs.stringify(data.data)
            }).then(function (response) {
                return resolve(response)
            })
                .catch(function (error) {
                    return error
                });
        })
    },
    get(data) {
        let token = localStorage.getItem("Backstage_Token")
        return new Promise((resolve) => {
            axios({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: token
                },
                method: 'get',
                url: data.url,
                data: data.data
            }).then(function (response) {
                return resolve(response)
            })
                .catch(function (error) {
                    return error
                });
        })
    },
    put(data) {
        let token = localStorage.getItem("Backstage_Token")
        return new Promise((resolve) => {
            axios({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    token: token
                },
                method: 'put',
                url: data.url,
                data: Qs.stringify(data.data)
            }).then(function (response) {
                return resolve(response)
            })
                .catch(function (error) {
                    return error
                });
        })
    }
}

export default Request
