<template>
    <div>
        <v-row>
            <v-col v-if="src" cols="1" >
                <v-icon @click="upload">mdi-clipboard-file-outline</v-icon>
            </v-col>
            <v-col v-else cols="1">
                <v-btn icon @click="upload">
                    <v-icon>mdi-upload</v-icon>
                </v-btn>
            </v-col>
            <v-col v-if="progress.buffer != 0">
                <v-progress-linear
                    stream
                    color="orange"
                    :buffer-value="progress.buffer"
                    :value="progress.value"
                ></v-progress-linear>
            </v-col>
            <v-col v-if="progress.buffer != 0 && progress.value != 100">
                {{ ( progress.speed / 1024 ).toFixed(2) }} kb/s
            </v-col>
        </v-row>
        <input ref="ipt" type="file" style="display: none" @change="commit">
    </div>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_resource_upload_stream, api_resource_upload_stream_end, api_resource_upload_stream_init } from '../../interface/api'
export default {
    props : ['height'],
    data : () => ({
        src : '',
        progress : {
            buffer: 0,
            value : 0,
            speed : 0
        }
    }),
    model : {
        event : 'change',
        prop : 'id'
    },
    methods : {
        upload(){
            const ipt = this.$refs.ipt
            ipt.click()
        },
        async commit(){
            const file = this.$refs.ipt.files[0]
            if(!file){
                return
            }

            let id = ''
            const { data } = await api_resource_upload_stream_init(file.name)
            if(!data){
                openErrorMessageBox('错误', '请检查网络连接')
                return
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                    return
                }else{
                    id = data['data']
                }
            }

            const bytes_per_piece = 4 * 1024 * 1024

            let start = 0, end
            const filesize = file.size

            for(;start < filesize;){
                const start_time = (new Date()).getTime()

                end = start + bytes_per_piece

                this.progress.buffer = ( end / filesize ) * 100
                this.progress.value = ( start / filesize ) * 100

                if(end > filesize){
                    end = filesize
                }

                const chunk = file.slice(start, end)
                
                let i = 0;
                for(; i < 2; i++){
                    const { data: stream_data } = await api_resource_upload_stream(id, chunk)
                    if(!stream_data){
                        openErrorMessageBox('错误', '网络错误')
                        return
                    }else{
                        if(stream_data['res'] == -2){
                            openErrorMessageBox('错误', stream_data['err'])
                            return
                        }else if(stream_data['res'] == 0){
                            break
                        }
                    }
                }

                if(i == 2){
                    openErrorMessageBox('错误', '上传发送致命错误')
                    return
                }

                const end_time = (new Date()).getTime()

                this.progress.speed = bytes_per_piece / (( end_time - start_time ) / 1000)

                start = end
            }

            this.progress.value = 100

            const { data: end_data } = await api_resource_upload_stream_end(id)
            if(!end_data){
                openErrorMessageBox('错误', '请检查网络连接')
                return
            }else{
                if(end_data['res'] != 0){
                    openErrorMessageBox('错误', end_data['err'])
                    return
                }else{
                    this.src = end_data['data']['extra']
                    this.$emit('change', end_data['data']['id'])
                }
            }
        }
    }
}
</script>

<style>

</style>