import axios from 'axios'
import { stringify } from 'querystring'

const api_base = (url, method, args) => new Promise( resolve => {
    (async function(){
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

export const api_register = (username, password, emailcode) => api_base('auth/register', 'post', stringify({username, password, emailcode}))

export const api_login = (email, password, captcha) => api_base('auth/login', 'post', stringify({email, password, captcha}))

export const api_get_math_captcha = method => api_base('captcha/math', 'get', stringify({ method }))

export const api_get_email_captcha = (captcha, method, email) => api_base('captcha/email', 'post', stringify({captcha, method, email}))
