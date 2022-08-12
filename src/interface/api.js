import axios from 'axios'
import { stringify } from 'querystring'
import { getAuthToken } from '../util/auth'
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
        const auth_token = getAuthToken()
        switch(method.toLowerCase()){
            case 'post':
                try{
                    let data
                    if( !auth_token) {
                        data = await axios.post(url, args)
                    } else {
                        data = await axios.post(url, args, {
                            headers: {
                                'Start-Dash': getAuthToken()
                            }
                        })
                    }
                    resolve(typeof data === 'string' ? false : data)
                }catch(e){
                    resolve(false)
                }
                break
            case 'get':
                try{
                    let data
                    if (!auth_token) {
                        data = await axios.get(url + '?' + args)
                    } else {
                        data = await axios.get(url + '?' + args, {
                            headers: {
                                'Start-Dash': getAuthToken()
                            }
                        })
                    }
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

export const api_organization_manage_list_member = gid => api_base('org/manage/list-member', 'get', stringify({ gid }))

export const api_organization_manage_list_orgs = () => api_base('org/manage/list-org', 'get', '')

export const api_organization_new = (name, desc) => api_base('org/create', 'post', stringify({ name, desc }))

export const api_organization_apply_join = (gid, text, org_username) => api_base('org/apply/join', 'post', stringify({ gid, text, org_username }))

export const api_organization_manage_appoint = (gid, uid) => api_base('org/manage/appoint', 'post', stringify({ gid, uid }))

export const api_organization_manage_cancel = (gid, uid) => api_base('org/manage/cancel', 'post', stringify({ gid, uid }))

export const api_organization_remove_member = (gid, uid) => api_base('org/manage/remove-member', 'post', stringify({ gid, uid }))

export const api_docker_image_get = (page, len) => api_base('docker/images', 'get', stringify({ page, len }))

export const api_docker_image_insert = (image_name, port_protocol) => api_base('docker/new', 'post', stringify({ image_name, port_protocol }))

export const api_docker_image_insert_check = request_id => api_base('docker/new/check', 'post', stringify({ request_id }))

export const api_docker_image_delete = image_id => api_base('docker/delete', 'post', stringify({ image_id }))

export const api_message_system_list = (page, len) => api_base('message/system/list', 'get', stringify({ page, len }))

export const api_homework_publish = (org, title, endtime, desc) => api_base('homework/publish', 'post', stringify({ org, title, endtime, desc }))

export const api_homework_list = (page, len) => api_base('homework/list', 'get', stringify({ page, len }))

export const api_homework_get = hid => api_base('homework/get', 'get', stringify({ hid }))

export const api_homework_result_get= hid => api_base('homework/commit/get', 'get', stringify({ hid }))

export const api_homework_result_commit = (hid, text) => api_base('homework/commit/text', 'post', stringify({ hid, text }))

export const api_homework_publish_list = (page, len) => api_base('homework/publish/list', 'get', stringify({ page, len }))

export const api_homework_commits = hid => api_base('homework/commits', 'get', stringify({ hid }))

export const api_homework_mark = (uid, hid, score) => api_base('homework/mark', 'post', stringify({ uid, hid, score }))

export const api_resource_upload_image = file => new Promise(resolve => {
    (async function(){
        const form_data = new FormData()
        form_data.append('file', file, file.name)
        try{
            const data = await axios.post('resource/upload/image', form_data, {
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

export const api_course_create = (type, title, desc, cover_rid, is_public) => api_base('course/create', 'post', stringify({
   type, title, desc, cover_rid, public: is_public
}))

export const api_course_get_admin = (page, len) => api_base('course/list/admin', 'get', stringify({page, len}))

export const api_course_public_list = (page, len) => api_base('course/list/public', 'get', stringify({ page, len }))

export const api_course_detail = cid => api_base('course/detail', 'get', stringify({ cid }))

export const api_course_subscribe = cid => api_base('course/subscribe', 'post', stringify({ cid }))

export const api_course_admin_list_own = cid => api_base('course/list/admin/own', 'get', stringify({ cid }))

export const api_resource_upload_any = file => new Promise(resolve => {
    (async function(){
        const form_data = new FormData()
        form_data.append('file', file, file.name)
        try{
            const data = await axios.post('resource/upload/any', form_data, {
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

export const api_course_unit_create = (cid, name, cover_rid, ppt_rid, media_rid) => api_base('course/unit/create', 'post', stringify({ 
    cid, name, cover_rid, ppt_rid, media_rid
}))

export const api_course_get_progress = cid => api_base('course/progress', 'get', stringify({ cid }))

export const api_resource_upload_stream_init = file => api_base('resource/upload/stream/init', 'post', stringify({ file }))

export const api_resource_upload_stream = (id, file) => new Promise(resolve => {
    (async function(){
        const form_data = new FormData()
        form_data.append('file', file, file.name)
        form_data.append('id', id)
        try{
            const data = await axios.post('resource/upload/stream', form_data, {
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

export const api_resource_upload_stream_end = id => api_base('resource/upload/stream/end', 'post', stringify({ id }))

export const api_user_profile = () => api_base('user/profile', 'get', '')

export const api_course_update_unit = (id, cover_rid, media_rid, ppt_rid, name) => api_base('course/unit/update', 'post', stringify({
    id, cover_rid, media_rid, ppt_rid, name
}))

export const api_competition_game_create = (title, page_url, signup_start_time, signup_end_time, game_start_time, game_end_time, concats, type, is_private, cover_rid) => api_base('comp/game/admin/create', 'post', stringify({
    title, page_url, signup_start_time, signup_end_time, game_start_time, game_end_time, concats, type, is_private, cover_rid
}))

export const api_competition_game_list = (page, len) => api_base('comp/game/admin/list', 'get', stringify({ page, len }))

export const api_competition_game_player_list = (page, len) => api_base('comp/game/list', 'get', stringify({ page, len }))

export const api_competition_game_delete = cid => api_base('comp/game/admin/delete', 'post', stringify({ cid }))

export const api_competition_game_update = (cid, args) => api_base('comp/game/admin/update', 'post', stringify({ cid, ...args }))

export const api_competition_signup = (competition_id, nickname) => api_base('comp/game/signup', 'post', stringify({ competition_id, nickname }))

export const api_competition_game_signup_my = () => api_base('comp/game/signup/my', 'get', '')

export const api_competition_game_detail = competition_id => api_base('comp/game/detail', 'get', stringify({ competition_id }))

export const api_competition_game_detail_upload = (competition_id, html_content) => api_base('comp/game/detail/upload', 'post', stringify({ competition_id, html_content }))

export const api_comeptition_game_subject_admin_list = competition_id => api_base('comp/game/admin/subject/list', 'get', stringify({ competition_id }))

export const api_competition_game_subject_admin_create = (
    image, comment, origin_score, ctf_flag, title, port_protocol, flag_type, flag_path, competition_id, start_time, subject_type, hint
) => api_base('comp/game/admin/subject/add', 'post', stringify({ 
    image, comment, origin_score, ctf_flag, title, port_protocol, flag_type, flag_path, competition_id, start_time, subject_type, hint
 }))

export const api_competition_game_subject_admin_update = (cid, args) => api_base('comp/game/admin/subject/update', 'post', stringify({ cid, ...args }))

export const api_competition_game_subject_admin_delete = cid => api_base('comp/game/admin/subject/delete', 'post', stringify({ cid }))

export const api_competition_game_subject_list = competition_id => api_base('comp/game/subject/list', 'get', stringify({ competition_id }))

export const api_competition_game_subject_detail = subject_id => api_base('comp/game/subject/detail', 'get', stringify({ subject_id }))

export const api_competition_game_subject_launch = (competition_id, subject_id) => api_base('comp/game/subject/launch', 'post', stringify({ competition_id, subject_id }))

export const api_competition_game_subject_stop = () => api_base('comp/game/subject/stop', 'post', '')

export const api_competition_game_subject_status = () => api_base('comp/game/subject/status', 'get', '')

export const api_competition_game_subject_request_result = request_id => api_base('comp/game/subject/result', 'get', stringify({ request_id }))

export const api_competition_game_subject_commit_flag = (subject_id, flag) => api_base('comp/game/subject/commit-flag', 'post', stringify({ subject_id, flag }))

export const api_competition_game_rank = competition_id => api_base('comp/game/rank', 'get', stringify({ competition_id }))