import { getAuthToken } from '../util/auth'
import axios from 'axios'

export const api_resource_upload_any_private = file => new Promise(resolve => {
    (async function(){
        const form_data = new FormData()
        form_data.append('file', file, file.name)
        try{
            const data = await axios.post('resource/upload/any/private', form_data, {
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