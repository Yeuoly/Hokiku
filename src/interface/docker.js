import {
    api_base    
} from './api'
import { stringify } from 'querystring'
import { getAuthToken } from '../util/auth'
import axios from 'axios'

export const api_get_docker_nodes = () => api_base('docker/admin/nodes', 'get', '')

export const api_get_docker_networks = () => api_base('docker/admin/network/list', 'get', '')

export const api_docker_native_service_image_list = () => api_base('docker/admin/native-service/image/list', 'get', '')

export const api_docker_native_service_image_delete = (image_id) => api_base('docker/admin/native-service/image/delete', 'post', stringify({
    image_id
}))

export const api_docker_native_service_image_build = (image_name, dockerzip) => new Promise(resolve => {
    (async function(){
        const form_data = new FormData()
        form_data.append('dockerzip', dockerzip, dockerzip.name)
        form_data.append('image_name', image_name)
        try{
            const data = await axios.post('docker/admin/native-service/image/build', form_data, {
                headers: {
                    'Start-Dash': getAuthToken()
                }
            })
            resolve(typeof data === 'string' ? false : data)
        }catch(e){
            resolve(false)
        }
    })()
})

export const api_docker_native_service_image_build_check = (message_response_id, status_response_id) => api_base('docker/admin/native-service/image/build/check', 'get', stringify({
    message_response_id, status_response_id
}))

export const api_docker_native_service_image_push = (image_name) => api_base('docker/admin/native-service/image/push', 'post', stringify({
    image_name
}))

export const api_docker_native_service_image_push_check = (message_response_id, status_response_id) => api_base('docker/admin/native-service/image/push/check', 'get', stringify({
    message_response_id, status_response_id
}))