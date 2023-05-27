import {
    api_base,
} from './api'
import { stringify } from 'querystring'
import axios from 'axios'
import { getAuthToken } from '../util/auth'

export const api_user_living_continus_list = (page, page_size) => api_base('user/living/continus/list', 'get', stringify({
    page, page_size
}))

export const api_user_import_template_default_excel = () => api_base('user/import/template/default/excel', 'get')

export const api_user_admin_list = (status, page, page_size) => api_base('user/admin/list', 'get', stringify({
    status, page, page_size
}))

export const api_user_admin_search = (page, page_size, keyword) => api_base('user/admin/search', 'get', stringify({
    page, page_size, keyword
}))

export const api_user_admin_password_reset = (uid, password) => api_base('user/admin/password/reset', 'post', stringify({
    uid, password
}))

export const api_user_admin_permission_update = (uid, permission) => api_base('user/admin/permission/update', 'post', stringify({
    uid, permission
}))

export const api_user_admin_profile_update = (uid, name, email) => api_base('user/admin/profile/update', 'post', stringify({
    uid, name, email
}))

export const api_user_admin_permission_list = () => api_base('user/admin/permission/list', 'get', '')

export const api_user_admin_import_excel = file => new Promise(resolve => {
    (async function(){
        const form_data = new FormData()
        form_data.append('file', file, file.name)
        try{
            const data = await axios.post('user/admin/import/execl', form_data, {
                headers: {
                    'Start-Dash': getAuthToken()
                }
            })
            resolve(typeof data === 'string' ? false : data)
        }catch(e){
            resolve(false)
        }
    })()
})

export const api_user_login_github = code => api_base('auth/login/github', 'post', stringify({
    code
}))

export const api_user_bind_github = code => api_base('auth/bind/github', 'post', stringify({
    code
}))