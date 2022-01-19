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

export const api_publish_collection = (struct, title) => api_base('coll/publish', 'post', stringify({ struct, title }))

export const api_commit_collection = (cid, data) => api_base('coll/commit', 'post', stringify({cid, data}))

export const api_list_collection = (page, len) => api_base('coll/list', 'post', stringify({ page, len }))

export const api_collection_statistics = cid => api_base('coll/result/statistics', 'post', stringify({ cid }))

export const api_collection_reuslt_list = (page, len) => api_base('coll/result/list', 'post', stringify({ page, len }))

export const api_collection_result_get = (cid, rid) => api_base('coll/result/get', 'post', stringify({ cid, rid }))

export const api_collection_result_update = (cid, rid, data) => api_base('coll/result/update', 'post', stringify({ cid, rid, data }))

export const api_competition_train_list = type => api_base('comp/admin/list-train', 'post', stringify({ class: type }))

export const api_competition_train_add = args => api_base('comp/admin/add-train', 'post', stringify(args))

export const api_competition_train_update = args => api_base('comp/admin/update-train', 'post', stringify(args))

export const api_competition_train_delete = id => api_base('comp/admin/delete-train', 'post', stringify({ id }))

export const api_competition_train_list_user = (page, len, type) => api_base('comp/user/list-train', 'post', stringify({ page, len, type }))

export const api_competition_train_start = id => api_base('comp/train/start', 'post', stringify({ id }))

export const api_competition_train_start_check = request_id => api_base('comp/train/start-check', 'post', stringify({ request_id }))

export const api_competition_train_status = () => api_base('comp/train/status', 'post', '')

export const api_competition_train_commit_flag = (id, flag) => api_base('comp/train/commit-flag', 'post', stringify({ train_id: id, flag }))

export const api_competition_train_get_score = uid => api_base('comp/train/score', 'get', stringify({ uid }))

export const api_competition_train_rank = () => api_base('comp/train/rank', 'get', '')

export const api_competition_train_shutdown = () => api_base('comp/train/shutdown', 'post', '')

export const api_competition_train_solved_user = id => api_base('comp/train/solved/train', 'get', stringify({ id }))

export const api_competition_train_user_solved = uid => api_base('comp/train/solved/user', 'get', stringify({ uid }))

export const api_organization_accept_apply = mid => api_base('org/apply/join/accept', 'post', stringify({ mid }))

export const api_organization_reject_apply = mid => api_base('org/apply/join/reject', 'post', stringify({ mid }))

export const api_organization_my = () => api_base('org/my', 'get', '')

export const api_organization_new = (name, desc) => api_base('org/create', 'post', stringify({ name, desc }))

export const api_docker_image_get = (page, len) => api_base('docker/images', 'get', stringify({ page, len }))

export const api_docker_image_insert = (image_name, port_protocol) => api_base('docker/new', 'post', stringify({ image_name, port_protocol }))

export const api_docker_image_insert_check = request_id => api_base('docker/new/check', 'post', stringify({ request_id }))

export const api_docker_image_delete = image_id => api_base('docker/delete', 'post', stringify({ image_id }))