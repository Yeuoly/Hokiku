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

export const api_awd_game_subject_checker_create = (subject_id, checker, cmd) => api_base('comp/awd/subject/checker/create', 'post', stringify({
    subject_id, checker, cmd
}))

export const api_awd_game_subject_checker_list = game_id => api_base('comp/awd/subject/checker/list', 'get', stringify({
    game_id
}))

export const api_awd_game_subject_checker_delete = checker_id => api_base('comp/awd/subject/checker/delete', 'post', stringify({
    checker_id
}))

export const api_awd_game_subject_check_test_run = (checker_id, message_callback) => new Promise((resolve) => {
    (async function run() {
        const { data } = await api_base('comp/awd/subject/checker/test/run', 'post', stringify({
            checker_id
        }))

        if (!data || data['res'] != 0) {
            return resolve({
                data : {
                    res: -1,
                    err: data['err']
                }
            })
        }

        const response_id = data['data']['response_id']
        const status_response_id = data['data']['status_response_id']
        let finished = false

        while(!finished) {
            const { data: status_data } = await api_base('comp/awd/subject/checker/test/run/check', 'post', stringify({
                response_id: response_id,
                status_response_id: status_response_id
            }))
    
            if (!status_data || status_data['res'] != 0) {
                return resolve({
                    data : {
                        res: -1,
                        err: status_data['err']
                    }
                })
            }

            finished = status_data['data']['finished']
            const err = status_data['data']['err']
            const message = status_data['data']['message']

            message_callback(message)

            if (finished) {
                if (err) {
                    return resolve({
                        data : {
                            res: -1,
                            err: err
                        }
                    })
                } else {
                    return resolve({
                        data : {
                            res: 0,
                        }
                    })
                }
            }

            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    })()
})

export const api_awd_game_subject_check_test_stop = checker_id => api_base('comp/awd/subject/checker/test/stop', 'post', stringify({
    checker_id
}))

export const api_awd_game_subject_check_test_list = game_id => api_base('comp/awd/subject/checker/test/list', 'get', stringify({
    game_id
}))

export const api_awd_game_subject_check_test_script = (checker_id, container_id) => api_base('comp/awd/subject/checker/test/script', 'post', stringify({
    checker_id, container_id
}))