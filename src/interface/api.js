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

export const api_user_info = uid => api_base('user/info', 'get', stringify({uid}))

export const api_user_repassword = (emailcode, password) => api_base('auth/repass', 'post', stringify({ emailcode, password }))

export const api_user_heartbeat = () => api_base('user/heartbeat', 'post', stringify({}))

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

export const api_competition_train_attachemnt_upload = (train_id, rid) => api_base('comp/train/attachment/upload', 'post', stringify({ train_id, rid }))

export const api_competition_train_attachemnt_list = train_id => api_base('comp/train/attachment/list', 'get', stringify({ train_id }))

export const api_competition_train_attachemnt_delete = attchment_id => api_base('comp/train/attachment/delete', 'post', stringify({ attchment_id }))

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

export const api_homework_republish = (hid) => api_base('homework/republish', 'post', stringify({ hid }))

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

export const api_course_get = cid => api_base('course/get', 'get', stringify({ cid }))

export const api_course_update = (cid, title, desc, cover_rid) => api_base('course/update', 'post', stringify({ cid, title, desc, cover_rid }))

export const api_course_subscribe = cid => api_base('course/subscribe', 'post', stringify({ cid }))

export const api_course_admin_list_own = cid => api_base('course/list/admin/own', 'get', stringify({ cid }))

export const api_course_search_public = (page, len, keyword) => api_base('course/search/public', 'get', stringify({ page, len, keyword }))

export const api_course_challenge_create = (name, unit_id, course_id, challenge_id, challenge_type, score, desc, hint) => api_base('course/challenge/create', 'post', stringify({
    name, unit_id, course_id, challenge_id, challenge_type, score, desc, hint
}))

export const api_course_challenge_update = (id, name, unit_id, course_id, challenge_id, challenge_type, score, desc, hint) => api_base('course/challenge/update', 'post', stringify({
    id, name, unit_id, cid: course_id, challenge_id, challenge_type, score, desc, hint
}))

export const api_course_challenge_delete = (cid, challenge_id) => api_base('course/challenge/delete', 'post', stringify({
    cid, challenge_id 
}))

export const api_course_challenge_unit_list = (cid, unit_id) => api_base('course/challenge/unit/list', 'get', stringify({ cid, unit_id }))

export const api_course_challenge_course_list = cid => api_base('course/challenge/course/list', 'get', stringify({ cid }))

export const api_course_challenge_get = (cid, challenge_id) => api_base('course/challenge/get', 'get', stringify({ cid, challenge_id }))

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

export const api_tools_shell_list = () => api_base('tools/shell/list', 'get', '')

export const api_tools_shell_apply = (method, mixer, anti_debugger, file) => new Promise(resolve => {
    (async function(){
        const form_data = new FormData()
        form_data.append('file', file, file.name)
        form_data.append('method', method)
        form_data.append('mixer', mixer)
        form_data.append('anti_debugger', anti_debugger)
        try{
            const data = await axios.post('tools/shell/apply', form_data, {
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

export const api_tools_shell_check = response_id => api_base('tools/shell/check', 'get', stringify({ response_id }))

export const api_user_profile = () => api_base('user/profile', 'get', '')

export const api_user_change_avatar = (mid) => api_base('user/info/avatar/update', 'post', stringify({ mid }))

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

export const api_competition_game_rank = (competition_id, page, page_size) => api_base('comp/game/rank', 'get', stringify({ competition_id, page, page_size }))

export const api_competition_game_attachemnt_upload = (subject_id, rid) => api_base('comp/game/attachment/upload', 'post', stringify({ subject_id, rid }))

export const api_competition_game_attachemnt_list = subject_id => api_base('comp/game/attachment/list', 'get', stringify({ subject_id }))

export const api_competition_game_attachemnt_delete = attchment_id => api_base('comp/game/attachment/delete', 'post', stringify({ attchment_id }))

export const api_competition_game_message_publish = (game_id, message) => api_base('comp/game/message/push', 'post', stringify({ game_id, message }))

export const api_competition_train_tag_create = tag => api_base('comp/train/tag/create', 'post', stringify({ tag }))

export const api_competition_train_tag_search = (tag, page, size) => api_base('comp/train/tag/search', 'get', stringify({ tag, page, size }))

export const api_competition_train_title_search = (title, page, size) => api_base('comp/train/title/search', 'get', stringify({ title, page, size }))

export const api_competition_train_id_search = (id) => api_base('comp/train/id/search', 'get', stringify({ id }))

export const api_native_server_param = () => api_base('native/server', 'get', '')

export const api_docker_container_list = () => api_base('docker/admin/container/list', 'get', '')

export const api_docker_container_stop = container_id => api_base('docker/admin/container/stop', 'post', stringify({ container_id }))

export const api_competition_train_note_get = (train_id) => api_base('comp/train/note/get', 'get', stringify({ train_id }))

export const api_competition_train_note_update = (train_id, content, content_type, is_wp) => api_base('comp/train/note/update', 'post', stringify({ train_id, content, content_type, is_wp }))

export const api_competition_train_wp_list = (train_id) => api_base('comp/train/wp/list', 'get', stringify({ train_id }))

export const api_competition_train_wp_get = (writeup_id) => api_base('comp/train/wp/get', 'get', stringify({ writeup_id }))

export const api_docker_image_list = () => api_base('docker/admin/image/list', 'get', '')

export const api_docker_image_core_delete = image_id => api_base('docker/admin/image/delete', 'post', stringify({ image_id }))

export const api_docker_sync = () => api_base('docker/admin/image/sync', 'post', '')

export const api_docker_sync_check = () => api_base('docker/admin/image/sync/check', 'get', '')

export const api_docker_container_history = (page, size) => api_base('docker/admin/container/history', 'get', stringify({ page, size }))

export const api_trade_list_coin_changes = (page, len) => api_base('trade/coin/list/changes', 'get', stringify({ page, len }))

export const api_trade_list_trade_order = (page, len) => api_base('trade/charge/list/order', 'get', stringify({ page, len }))

export const api_trade_admin_list_trade_order = (page, len) => api_base('trade/admin/charge/list/order', 'get', stringify({ page, len }))

export const api_trade_admin_list_coin_changes = (page, len) => api_base('trade/admin/coin/list/changes', 'get', stringify({ page, len }))

export const api_trade_admin_list_coins = (page, len) => api_base('trade/admin/coin/list', 'get', stringify({ page, len }))

export const api_trade_admin_coin_change = (uid, coin) => api_base('trade/admin/coin/change', 'post', stringify({ uid, coin }))

export const api_acm_admin_question_create = (title, comment_type, comment, score, author, price, difficulty, language, time_limit, memory_limit, type, exam_id) => api_base('acm/admin/question/create', 'post', stringify({ title, comment_type, comment, score, author, price, difficulty, language, time_limit, memory_limit, type, exam_id }))

export const api_acm_admin_question_edit = (question_id, title, comment_type, comment, author, price, difficulty, language, time_limit, memory_limit, type) => api_base('acm/admin/question/edit', 'post', stringify({ question_id, title, comment_type, comment, author, price, difficulty, language, time_limit, memory_limit, type }))

export const api_acm_admin_question_delete = (question_id) => api_base('acm/admin/question/delete', 'post', stringify({ question_id }))

export const api_acm_admin_testcase_create = (question_id, input, output, _public) => api_base('acm/admin/testcase/create', 'post', stringify({ question_id, input, output, public: _public }));

export const api_acm_admin_testcase_edit = (testcase_id, input, output, _public) => api_base('acm/admin/testcase/edit', 'post', stringify({ testcase_id, input, output, public: _public }));

export const api_acm_admin_testcase_delete = (testcase_id) => api_base('acm/admin/testcase/delete', 'post', stringify({ testcase_id }))

export const api_acm_admin_question_list = (page, len) => api_base('acm/admin/question/list', 'get', stringify({ page, len }))

export const api_acm_admin_testcase_list = (question_id) => api_base('acm/admin/testcase/list', 'get', stringify({ question_id }))

export const api_acm_admin_testing_list = (question_id) => api_base('acm/admin/testing/list', 'get', stringify({ question_id }))

export const api_acm_admin_testing_list_user = (user_id) => api_base('acm/admin/testing/list/user', 'get', stringify({ user_id }))

export const api_acm_admin_question_get = (question_id) => api_base('acm/admin/question/get', 'get', stringify({ question_id }))

export const api_acm_admin_question_writeup_list = (question_id) => api_base('acm/admin/question/writeup/list', 'get', stringify({ question_id }))

export const api_acm_admin_question_writeup_create = (question_id, content, price) => api_base('acm/admin/question/writeup/create', 'post', stringify({ question_id, content, price }))

export const api_acm_admin_question_writeup_edit = (writeup_id, content, price) => api_base('acm/admin/question/writeup/edit', 'post', stringify({ writeup_id, content, price }))

export const api_acm_admin_question_writeup_delete = (writeup_id) => api_base('acm/admin/question/writeup/delete', 'post', stringify({ writeup_id }))

export const api_acm_user_question_list = (page, len) => api_base('acm/user/question/list', 'get', stringify({ page, len }))

export const api_acm_user_testing_list = () => api_base('acm/user/testing/list', 'get')

export const api_acm_user_testing_submit = (question_id, code, language) => api_base('acm/user/testing/submit', 'post', stringify({ question_id, code, language }))

export const api_acm_user_testing_list_question = (question_id) => api_base('acm/user/testing/list/question', 'get', stringify({ question_id }))

//export const api_acm_user_ranklist = () => api_base('acm/user/ranklist', 'get')

export const api_acm_user_question_detail = (question_id) => api_base('acm/user/question/detail', 'get', stringify({ question_id }))

export const api_acm_user_testing_submit_check = (request_id) => api_base('acm/user/testing/submit/check', 'get', stringify({ request_id }))

export const api_acm_user_question_writeup_list = (question_id) => api_base('acm/user/question/writeup/list', 'get', stringify({ question_id }))

export const api_acm_user_statistics = (page, size) => api_base('acm/user/statistics', 'get', stringify({ page, size }))

export const api_acm_exam_create = (title, description, start_time, end_time, gid) => api_base('acm/exam/create', 'post', stringify({ title, description, start_time, end_time, gid }))

export const api_acm_exam_update = (exam_id, title, description, start_time, end_time) => api_base('acm/exam/update', 'post', stringify({ id : exam_id, title, description, start_time, end_time }))

export const api_acm_exam_delete = (exam_id) => api_base('acm/exam/delete', 'post', stringify({ id: exam_id }))

export const api_acm_exam_list = (page, size) => api_base('acm/exam/list', 'get', stringify({ page, size }))  

export const api_acm_exam_get = (exam_id) => api_base('acm/exam/get', 'get', stringify({ id: exam_id }))

export const api_acm_exam_question_list = (exam_id) => api_base('acm/exam/problems', 'get', stringify({ id : exam_id }))

export const api_acm_exam_statistics = (exam_id) => api_base('acm/exam/statistics', 'get', stringify({ id : exam_id }))

export const api_acm_exam_manager_commits_list = (id, uid, page, page_size) => api_base('acm/exam/manager/commits/list', 'get', stringify({ id, uid, page, page_size }))

export const api_tmpfile_download = token => {
    //download a file through axios with token in url and START-DASH in header
    return axios({
        url: '/tmpfile/download?token=' + token,
        method: 'GET',
        responseType: 'blob',
        headers: {
            'START-DASH': getAuthToken(),
        },
    }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file');
        document.body.appendChild(link);
        link.click();
        //remove the link after download
        link.parentNode.removeChild(link);
    })
}

export const api_signin = () => api_base('statistics/signin', 'get')

export const api_signin_list = () => api_base('statistics/signin/list', 'get')

export const api_create_blog = (title, content, content_type) => api_base('blog/create', 'post', stringify({ title, content, content_type }))

export const api_update_blog = (blog_id, title, content, content_type) => api_base('blog/update', 'post', stringify({ id: blog_id, title, content, content_type }))

export const api_delete_blog = (blog_id) => api_base('blog/delete', 'post', stringify({ id: blog_id }))

export const api_blog_list = (uid, page, len) => api_base('blog/list', 'get', stringify({ uid, page, len }))

export const api_blog_detail = (blog_id) => api_base('blog/get', 'get', stringify({ id: blog_id }))

/**
 * 	beego.Router("/prodesign/vm/launch", &controllers.LanuchVmController{})
	beego.Router("/prodesign/vm/launch/check", &controllers.LanuchVmCheckController{})
	beego.Router("/prodesign/vm/stop", &controllers.StopVmController{})
	beego.Router("/prodesign/vm/status", &controllers.GetVmStatusController{})
 * 
 */

export const api_prodesign_vm_launch = (vm_type) => api_base('prodesign/vm/launch', 'post', stringify({ vm_type }))

export const api_prodesign_vm_launch_check = (response_id) => api_base('prodesign/vm/launch/check', 'post', stringify({ response_id }))

export const api_prodesign_vm_stop = () => api_base('prodesign/vm/stop', 'post', '')

export const api_prodesign_vm_status = () => api_base('prodesign/vm/status', 'get', '')

export const api_prodesign_vm_overtime = () => api_base('prodesign/vm/overtime', 'post', '')

/**
 * beego.Router("/comp/awd/game/create", &controllers.AwdCreateGameController{})
	beego.Router("/comp/awd/game/list", &controllers.AwdGetGameListController{})
	beego.Router("/comp/awd/game/delete", &controllers.AwdDeleteGameController{})
	beego.Router("/comp/awd/game/update", &controllers.AwdUpdateGameController{})
	beego.Router("/comp/awd/game/get", &controllers.AwdGetGameController{})
	beego.Router("/comp/awd/subject/create", &controllers.CreateAwdSubjectController{})
	beego.Router("/comp/awd/subject/list", &controllers.AdminListAwdSubjectController{})
	beego.Router("/comp/awd/subject/delete", &controllers.DeleteAwdSubjectController{})
	beego.Router("/comp/awd/subject/update", &controllers.UpdateAwdSubjectController{})
	beego.Router("/comp/awd/subject/get", &controllers.AdminGetAwdSubjectController{})
	beego.Router("/comp/awd/team/create", &controllers.AwdJoinGameController{})
	beego.Router("/comp/awd/team/containers", &controllers.AwdGetGameListController{})
	beego.Router("/comp/awd/team/container", &controllers.AwdGetGameController{})
	beego.Router("/comp/awd/team/members", &controllers.ListAwdTeamMemberController{})
	beego.Router("/comp/awd/team/info", &controllers.GetAwdTeamInfoController{})
	beego.Router("/comp/awd/team/list", &controllers.AdminListAwdTeamController{})
	beego.Router("/comp/awd/rank/team", &controllers.RankAwdTeamController{})
	beego.Router("/comp/awd/rank/player", &controllers.RankAwdPlayerController{})
	beego.Router("/comp/awd/flag/commit", &controllers.AwdCommitFlagController{})
	beego.Router("/comp/awd/player/token", &controllers.GetAwdPlayerToken{})
 * 
 */

export const api_competition_awd_game_create = (name, start_time, end_time, description) => api_base('comp/awd/game/create', 'post', stringify({ name, start_time, end_time, description }))

export const api_competition_awd_game_list = () => api_base('comp/awd/game/list', 'get', '')

export const api_competition_awd_game_delete = (game_id) => api_base('comp/awd/game/delete', 'post', stringify({ game_id }))

export const api_competition_awd_game_update = (game_id, name, start_time, end_time, description) => api_base('comp/awd/game/update', 'post', stringify({ game_id, name, start_time, end_time, description }))

export const api_competition_awd_game_get = (game_id) => api_base('comp/awd/game/get', 'get', stringify({ game_id }))

/**
 * GameId              int    `json:"game_id" valid:"Required" form:"game_id"`
		Name                string `json:"name" valid:"Required;MaxSize(64)" form:"name"`
		Comment             string `json:"comment" valid:"Required;MaxSize(256)" form:"comment"`
		AttackInitialScore  int    `json:"attack_initial_score" valid:"Required;Min(100)" form:"attack_initial_score"`
		DefenseInitialScore int    `json:"defense_initial_score" valid:"Required;Min(100)" form:"defense_initial_score"`
		DockerImage         string `json:"docker_image" valid:"Required;MaxSize(256)" form:"docker_image"`
		ExposePorts         string `json:"expose_ports" valid:"Required;MaxSize(256)" form:"expose_ports"`
		DefaultUser         string `json:"default_user" valid:"Required;MaxSize(64)" form:"default_user"`
		StartTime           int64  `json:"start_time" valid:"Required" form:"start_time"`
		EndTime             int64  `json:"end_time" valid:"Required" form:"end_time"`
		FlagType            int    `json:"flag_type" valid:"Required;Min(0);Max(3)" form:"flag_type"`
		FlagPath            string `json:"flag_path" valid:"Required;MaxSize(256)" form:"flag_path"`
		FlagRefreshInterval int    `json:"flag_refresh_interval" valid:"Required;Min(120)" form:"flag_refresh_interval"`
		Checker             string `json:"checker" valid:"Required;MaxSize(256)" form:"checker"`
 */
export const api_competition_awd_subject_create = (
    game_id, name, comment, attack_initial_score, defense_initial_score, docker_image, expose_ports, 
    default_user, start_time, end_time, flag_type, flag_path, flag_refresh_interval, checker, environment
) => api_base('comp/awd/subject/create', 'post', stringify({
    game_id, name, comment, attack_initial_score, defense_initial_score, docker_image, expose_ports,
    default_user, start_time, end_time, flag_type, flag_path, flag_refresh_interval, checker, environment
}))

export const api_competition_awd_subject_list = (game_id) => api_base('comp/awd/subject/list', 'get', stringify({ game_id }))

export const api_competition_awd_subject_delete = (subject_id) => api_base('comp/awd/subject/delete', 'post', stringify({ subject_id }))

export const api_competition_awd_subject_update = (
    subject_id, name, comment, attack_initial_score, defense_initial_score, docker_image, expose_ports,
    default_user, start_time, end_time, flag_type, flag_path, flag_refresh_interval, checker, environment
) => api_base('comp/awd/subject/update', 'post', stringify({
    subject_id, name, comment, attack_initial_score, defense_initial_score, docker_image, expose_ports,
    default_user, start_time, end_time, flag_type, flag_path, flag_refresh_interval, checker, environment
}))

export const api_competition_awd_subject_get = (subject_id) => api_base('comp/awd/subject/get', 'get', stringify({ subject_id }))

/**
 * 
 * @param {*} game_id 
 * @param {*} team_name 
 * @param {*} leader_name 
 * @param {*} players JSON string which is an array , e.g. [{"name":"player1","email":"aaa@xxx.com","uid":123456,"token":"abc"}]
 * @returns 
 */
export const api_competition_awd_team_create = (game_id, team_name, leader_name, players) => api_base('comp/awd/team/create', 'post', stringify({ game_id, team_name, leader_name, players }))

export const api_competition_awd_team_get_containers = (game_id) => api_base('comp/awd/team/containers', 'get', stringify({ game_id }))

export const api_competition_awd_team_get_container = (game_id, container_id) => api_base('comp/awd/team/container', 'get', stringify({ container_id, game_id }))

export const api_competition_awd_team_get_members = (game_id, team_id) => api_base('comp/awd/team/members', 'get', stringify({ game_id, team_id }))

export const api_competition_awd_team_get_info = (game_id) => api_base('comp/awd/team/info', 'get', stringify({ game_id }))

export const api_competition_awd_team_list = (game_id) => api_base('comp/awd/team/list', 'get', stringify({ game_id }))

export const api_competition_awd_team_sshpassword_logs = (game_id) => api_base('comp/awd/team/sshpassword/logs', 'get', stringify({ game_id }))

export const api_competition_awd_team_sshpassword_reset = (game_id, username, password) => api_base('comp/awd/team/sshpassword/reset', 'post', stringify({ game_id, username, password }))

export const api_competition_awd_team_statistics = (game_id) => api_base('comp/awd/team/statistics', 'get', stringify({ game_id }))

export const api_competition_awd_rank_team = (game_id, page, page_size, order) => api_base('comp/awd/rank/team', 'get', stringify({ game_id, page, page_size, order }))

export const api_competition_awd_rank_player = (game_id, page, page_size, order) => api_base('comp/awd/rank/player', 'get', stringify({ game_id, page, page_size, order }))

export const api_competition_awd_commit_flag = (game_id, team_id, flag) => api_base('comp/awd/flag/commit', 'post', stringify({ game_id, team_id, flag }))

export const api_competition_awd_player_get_token = () => api_base('comp/awd/player/token', 'get', '')

export const api_competition_awd_boardcast_list = (game_id) => api_base('comp/awd/boardcast/list', 'get', stringify({ game_id }))

export const api_competition_awd_boardcast_commit = (game_id, content) => api_base('comp/awd/boardcast/commit', 'post', stringify({ game_id, content }))

export const api_competition_awd_admin_list_containers = (game_id) => api_base('/comp/awd/admin/containers/list', 'get', stringify({ game_id }))