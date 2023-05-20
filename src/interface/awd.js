import {
    api_base    
} from './api'
import { stringify } from 'querystring'

export const api_inspect_awd_game = (game_id) => api_base('comp/awd/admin/game/inpsect', 'get', stringify({
    game_id
}))

export const api_awd_game_set_node = (game_id, node_id) => api_base('comp/awd/admin/game/node/set', 'post', stringify({
    game_id, node_id
}))

export const api_awd_game_subnet_create = game_id => api_base('comp/awd/game/subnet/create', 'post', stringify({
    game_id
}))

export const api_awd_game_subnet_remove = game_id => api_base('comp/awd/game/subnet/remove', 'post', stringify({
    game_id
}))

export const api_awd_game_subnet_inspect = game_id => api_base('comp/awd/game/subnet/inpsect', 'post', stringify({
    game_id
}))

export const api_awd_game_subject_relaunch = subject_id => api_base('comp/awd/subject/relaunch', 'post', stringify({
    subject_id
}))