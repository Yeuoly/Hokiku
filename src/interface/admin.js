import {
    api_base
} from './api'
import { stringify } from 'querystring'

export const api_admin_org_manager_appoint = (gid, uid) => api_base('admin/org/manager/appoint', 'post', stringify({
    gid, uid
}))

export const api_admin_org_search = (keyword) => api_base('admin/org/search', 'get', stringify({
    keyword
}))