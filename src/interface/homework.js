import {
    api_base    
} from './api'
import {
    stringify
} from 'qs'

export const api_homework_export = hid => api_base('homework/export', 'get', stringify({hid}))

export const api_homework_publish_train = (org, title, endtime, desc, train_id) => api_base('homework/publish/ctf', 'post', stringify({ org, title, endtime, desc, train_id }))

export const api_homework_check_ctf = (hid) => api_base('homework/check/ctf', 'post', stringify({hid}))