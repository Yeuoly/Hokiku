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

export const api_awd_game_team_list = gid => api_base('comp/awd/game/list/team', 'get', stringify({
    gid
}))

export const api_awd_game_generate_invite_code = (game_id, count) => api_base('comp/awd/game/invite/gen', 'post', stringify({
    game_id, count
}))

export const api_awd_game_subject_test_launch = subject_id => api_base('comp/awd/subject/test/launch', 'post', stringify({
    subject_id
}))

export const api_awd_game_subject_test_stop = subject_id => api_base('comp/awd/subject/test/stop', 'post', stringify({
    subject_id
}))

export const api_awd_game_subject_test_list = game_id => api_base('comp/awd/subject/test/list', 'get', stringify({
    game_id
}))