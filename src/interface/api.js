import axios from 'axios'
import { stringify } from 'querystring'

const api_base = (url, method, args) => new Promise( resolve => {
    (async function(){
        args = args || ''
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
            hid : 0, title : '测试', desc : 'PHP反序列化', time : '2021-7-16 16:00', end_at : '2022-7-16'
        }])
    }, 1000)
})