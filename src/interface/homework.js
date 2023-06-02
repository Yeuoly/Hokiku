import {
    api_base    
} from './api'
import {
    stringify
} from 'qs'

export const api_homework_export = hid => api_base('homework/export', 'get', stringify({hid}))