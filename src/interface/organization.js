import {
    api_base    
} from './api'
import { stringify } from 'querystring'

export const api_organization_member_rename = (gid, uid, name) => api_base('org/manage/rename', 'post', stringify({
    gid, uid, name
}))