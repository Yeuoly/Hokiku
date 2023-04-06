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