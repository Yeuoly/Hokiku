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

export const api_comp_service_list_running = () => api_base('/comp/service/list/running', 'get')

