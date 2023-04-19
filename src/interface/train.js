import {
    api_base    
} from './api'
import { stringify } from 'querystring'

export const api_competition_train_attachement_request = (train_id) => api_base('comp/train/attachment/request', 'get', stringify({
    train_id
}))