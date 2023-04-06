import {
    api_base    
} from './api'

export const api_get_docker_nodes = () => api_base('docker/admin/nodes', 'get', '')

export const api_get_docker_networks = () => api_base('docker/admin/network/list', 'get', '')