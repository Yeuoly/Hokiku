import {
    api_base    
} from './api'
import { stringify } from 'querystring'

export const api_organization_member_rename = (gid, uid, name) => api_base('org/manage/rename', 'post', stringify({
    gid, uid, name
}))

export const api_organization_member_living_continus_list = (gid) => api_base('org/manage/members/living/continus/list', 'get', stringify({
    gid
}))

export const api_organization_member_train_commit_check = gid => api_base('org/manage/members/train/duplicate', 'get', stringify({
    gid
}))