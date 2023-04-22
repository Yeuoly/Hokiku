import {
    api_base    
} from './api'
import { stringify } from 'querystring'
import { getAuthToken } from '../util/auth'
import axios from 'axios'

export const api_organization_member_rename = (gid, uid, name) => api_base('org/manage/rename', 'post', stringify({
    gid, uid, name
}))

export const api_organization_member_living_continus_list = (gid) => api_base('org/manage/members/living/continus/list', 'get', stringify({
    gid
}))

export const api_organization_member_train_commit_check = gid => api_base('org/manage/members/train/duplicate', 'get', stringify({
    gid
}))

export const api_organization_train_build = (gid, image_name, dockerzip) => new Promise(resolve => {
    (async function(){
        const form_data = new FormData()
        form_data.append('dockerzip', dockerzip, dockerzip.name)
        form_data.append('image_name', image_name)
        form_data.append('gid', gid)
        try{
            const data = await axios.post('org/manage/train/build', form_data, {
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

export const api_organization_train_build_check = (message_response_id, status_response_id) => api_base('org/manage/train/build/check', 'get', stringify({
    message_response_id, status_response_id
}))

export const api_organization_train_push = (gid, image_id) => api_base('org/manage/train/push', 'post', stringify({
    gid, image_id
}))

export const api_organization_train_push_check = (message_response_id, status_response_id) => api_base('org/manage/train/push/check', 'get', stringify({
    message_response_id, status_response_id
}))

export const api_organization_train_image_pull = (gid, image_name) => api_base('org/manage/train/image/pull', 'post', stringify({
    gid, image_name
}))

export const api_organization_train_image_pull_check = (message_response_id, status_response_id) => api_base('org/manage/train/image/pull/check', 'get', stringify({
    message_response_id, status_response_id
}))

export const api_organization_train_image_list = gid => api_base('org/manage/train/image/list', 'get', stringify({
    gid
}))

export const api_organization_train_image_delete = (gid, image_id) => api_base('org/manage/train/image/delete', 'post', stringify({
    gid, image_id
}))

export const api_organization_train_add = (
    gid, title, author, image, comment, ctf_flag, flag_dynamic, port_protocol, type, flag_path, flag_type, tags, score, socre_dynamic
) => api_base('org/manage/train/add', 'post', stringify({
    gid, title, author, image, comment, ctf_flag, flag_dynamic, port_protocol, type, flag_path, flag_type, tags, score, socre_dynamic
}))

export const api_organization_manage_train_list = (gid, page, page_size) => api_base('org/manage/train/list', 'get', stringify({
    gid, page, page_size
}))

export const api_organization_manage_train_sheet_rank = (gid, sid) => api_base('org/manage/train/sheet/rank', 'get', stringify({
    gid, sid
}))

export const api_organization_manage_train_sheet_create = (gid, name, comment) => api_base('org/manage/train/sheet/create', 'post', stringify({
    gid, name, comment
}))

export const api_organization_manage_train_sheet_list = gid => api_base('org/manage/train/sheet/list', 'get', stringify({
    gid
}))

export const api_organization_manage_train_sheet_delete = (gid, sid) => api_base('org/manage/train/sheet/delete', 'post', stringify({
    gid, sid
}))

export const api_organization_manage_train_sheet_add = (gid, sid, tid) => api_base('org/manage/train/sheet/add', 'post', stringify({
    gid, sid, tid
}))

export const api_organization_manage_train_sheet_remove = (gid, sid, tid) => api_base('org/manage/train/sheet/remove', 'post', stringify({
    gid, sid, tid
}))

export const api_organization_manage_train_sheet_update = (gid, sid, name, comment) => api_base('org/manage/train/sheet/update', 'post', stringify({
    gid, sid, name, comment
}))

export const api_organization_train_list = (gid) => api_base('org/train/list', 'get', stringify({
    gid
}))

export const api_organization_train_sheet_list = (gid) => api_base('org/train/sheet/list', 'get', stringify({
    gid
}))

export const api_organization_train_sheet_detail = (gid, sid) => api_base('org/train/sheet/detail', 'get', stringify({
    gid, sid
}))

export const api_organization_course_list = (gid) => api_base('org/course/list', 'get', stringify({
    gid
}))

export const api_organization_manage_course_bind_list = (cid) => api_base('org/manage/course/bind/list', 'get', stringify({
    cid
}))

export const api_organization_manage_course_bind = (cid, gid) => api_base('org/manage/course/bind', 'post', stringify({
    cid, gid
}))

export const api_organization_manage_course_unbind = (cid, gid) => api_base('org/manage/course/unbind', 'post', stringify({
    cid, gid
}))