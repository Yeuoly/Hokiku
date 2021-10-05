import axios from 'axios'
import { stringify } from 'querystring'
import VueCookie from 'vue-cookie'

let csrf_token = VueCookie.get("irina_jct") || ''

export const getCsrftoken = () => {
    return csrf_token
}

export const setCsrftoken = token => {
    csrf_token = token
}

const api_base = (url, method, args) => new Promise( resolve => {
    (async function(){
        args = args || ''
        args = ( args == '' ? '' : args + '&' ) + 'csrf_token=' + csrf_token
        switch(method.toLowerCase()){
            case 'post':
                try{
                    const data = await axios.post(url, args)
                    resolve(typeof data === 'string' ? false : data)
                }catch(e){
                    resolve(false)
                }
                break
            case 'get':
                try{
                    const data = await axios.get(url + '?' + args)
                    resolve(typeof data === 'string' ? false : data)
                }catch(e){
                    resolve(false)
                }
                break
        }
    })()
})

export const api_auth_register = (username, password, emailcode) => api_base('auth/register', 'post', stringify({username, password, emailcode}))

export const api_auth_login = (email, password, captcha) => api_base('auth/login', 'post', stringify({email, password, captcha}))

export const api_get_math_captcha = method => api_base('captcha/math', 'get', stringify({ method }))

export const api_get_email_captcha = (captcha, method, email) => api_base('captcha/email', 'post', stringify({captcha, method, email}))

export const api_auth_check = () => api_base('auth/check', 'post')

export const api_get_homework_record = (page) => new Promise(resolve => {
    console.log(page)
    setTimeout(() => {
        resolve([{
            hid : 1, title : '测试', desc : 'PHP反序列化', time : '2021-7-16 16:00', end_at : '2022-7-16'
        }])
    }, 1000)
})

export const api_get_homeworks = (page) => new Promise(resolve => {
    console.log(page)
    setTimeout(() => {
        resolve([{
            hid : 1, title : '测试', publisher : '李林', desc : 'PHP反序列化', time : '2021-7-16 16:00', end_at : '2022-7-16'
        }])
    }, 1000)
})

export const api_get_homework = (hid) => new Promise(resolve => {
    console.log(hid)
    setTimeout(() => {
        resolve({
            res : 1,
            err : null,
            data : {
                hid : hid,
                title : '测试作业',
                publisher : '李林',
                desc : 'PHP反序列化',
                time : 1626422400, 
                end_at : 1657958400,
                ans : '<div>测试测试测试</div>'
            }
        })
    }, 1000)
})

export const api_get_csrftoken = () => api_base('auth/csrf', 'post')

export const api_logout = () => api_base('auth/logout', 'post')

export const api_get_collection = cid => api_base('coll/get', 'post', stringify({ cid }))