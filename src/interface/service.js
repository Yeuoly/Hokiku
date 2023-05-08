import {
    api_base    
} from './api'
import { stringify } from 'querystring'

export const api_comp_service_create = (name, description, author, gid, score, price, service_config) => api_base('/comp/service/create', 'post', stringify({
    name, description, author, gid, score, price, service_config
}))

export const api_comp_service_update = (sid, name, description, author, score, price, service_config) => api_base('/comp/service/update', 'post', stringify({
    sid, name, description, author, score, price, service_config
}))

export const api_comp_service_delete = (sid) => api_base('/comp/service/delete', 'post', stringify({
    sid
}))

export const api_comp_service_get = (sid) => api_base('/comp/service/get', 'get', stringify({
    sid
}))

export const api_comp_service_list = (gid) => api_base('/comp/service/list', 'get', stringify({
    gid
}))

export const api_comp_service_member_list = (gid) => api_base('/comp/service/member/list', 'get', stringify({
    gid
}))

export const api_comp_service_public_list = (page, page_size) => api_base('/comp/service/public/list', 'get', stringify({
    page, page_size
}))

export const api_comp_service_make_public = (sid) => api_base('/comp/service/make/public', 'post', stringify({
    sid
}))

export const api_comp_service_make_private = (sid) => api_base('/comp/service/make/private', 'post', stringify({
    sid
}))

export const api_comp_service_rank = (sid) => api_base('/comp/service/rank', 'get', stringify({
    sid
}))

export const api_comp_service_launch = (sid) => api_base('/comp/service/launch', 'post', stringify({
    sid
}))

export const api_comp_service_launch_check = (message_response_id, finish_response_id) => api_base('/comp/service/launch/check', 'get', stringify({
    message_response_id, finish_response_id
}))

export const api_comp_service_extend = () => api_base('/comp/service/extend', 'post')

export const api_comp_service_check = () => api_base('/comp/service/check', 'get')

export const api_comp_service_stop = () => api_base('/comp/service/stop', 'post')

export const api_comp_service_stop_check = (finish_response_id) => api_base('/comp/service/stop/check', 'get', stringify({
    finish_response_id
}))

export const api_comp_service_flag_commit = (flags) => api_base('/comp/service/flag/commit', 'post', stringify({
    flags
}))

export const api_comp_service_list_running = () => api_base('/comp/service/list/running', 'get')

export const api_comp_service_writeup_list = (sid) => api_base('/comp/service/writeup/list', 'get', stringify({
    sid
}))

export const api_comp_service_writeup_buy = (wid) => api_base('/comp/service/writeup/buy', 'post', stringify({
    wid
}))

export const api_comp_service_writeup_get = (wid) => api_base('/comp/service/writeup/get', 'get', stringify({
    wid
}))

export const api_comp_service_writeup_create = (sid, content, price) => api_base('/comp/service/writeup/create', 'post', stringify({
    sid, content, price
}))

export const api_comp_service_writeup_update = (wid, content, price) => api_base('/comp/service/writeup/update', 'post', stringify({
    wid, content, price
}))

export const api_comp_service_writeup_vote = (wid, score) => api_base('/comp/service/writeup/vote', 'post', stringify({
    wid, score
}))