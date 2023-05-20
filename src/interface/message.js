import {
    api_base    
} from './api'

export const api_message_has_new = () => api_base('message/new', 'get', '')

export const api_message_new_flush = () => api_base('message/new/flush', 'post', '')