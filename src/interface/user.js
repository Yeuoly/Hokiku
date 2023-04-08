import {
    api_base    
} from './api'
import { stringify } from 'querystring'

export const api_user_living_continus_list = (page, page_size) => api_base('user/living/continus/list', 'get', stringify({
    page, page_size
}))