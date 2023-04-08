import {
    api_base    
} from './api'
import { stringify } from 'querystring'

export const api_boardcast_carousel_create = (title, content, image, show) => api_base('boardcast/carousel/create', 'post', stringify({
    title, content, image, show
}))

export const api_boardcast_carousel_update = (id, title, content, image, show) => api_base('boardcast/carousel/update', 'post', stringify({
    id, title, content, image, show
}))

export const api_boardcast_carousel_delete = (id) => api_base('boardcast/carousel/delete', 'post', stringify({
    id
}))

export const api_boardcast_carousel_list = (page) => api_base('boardcast/carousel/list', 'get', stringify({
    page
}))

export const api_boardcast_carousel_list_admin = (page) => api_base('boardcast/carousel/list/admin', 'get', stringify({
    page
}))

export const api_boardcast_updatelog_create = (content, version) => api_base('boardcast/updatelog/create', 'post', stringify({
    content, version
}))

export const api_boardcast_updatelog_update = (id, content, version) => api_base('boardcast/updatelog/update', 'post', stringify({
    id, content, version
}))

export const api_boardcast_updatelog_delete = (id) => api_base('boardcast/updatelog/delete', 'post', stringify({
    id
}))

export const api_boardcast_updatelog_list = (page) => api_base('boardcast/updatelog/list', 'get', stringify({
    page
}))

export const api_boardcast_newspost_create = (content, icon) => api_base('boardcast/newspost/create', 'post', stringify({
    content, icon
}))

export const api_boardcast_newspost_update = (id, content, icon) => api_base('boardcast/newspost/update', 'post', stringify({
    id, content, icon
}))

export const api_boardcast_newspost_delete = (id) => api_base('boardcast/newspost/delete', 'post', stringify({
    id
}))

export const api_boardcast_newspost_list = (page) => api_base('boardcast/newspost/list', 'get', stringify({
    page
}))
