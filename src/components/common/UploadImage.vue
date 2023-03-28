<template>
    <div>
        <v-row style="margin: 0">
            <v-col cols="12">
                <v-img 
                    class="irina-upload-img clickable" 
                    @click="upload" 
                    :src="src" 
                    :height="height"
                    :class="{'irina-upload-img-default' : !src}"
                >
                    <div 
                        class="cover"
                        :style="{'height' : height + 'px'}"
                    >
                        <v-icon size="50">
                            mdi-cloud-upload
                        </v-icon>
                    </div>
                </v-img>
            </v-col>
        </v-row>
        <input ref="ipt" type="file" style="display: none" @change="commit">
    </div>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_resource_upload_image } from '../../interface/api'
export default {
    props : ['height'],
    data : () => ({
        src : ''
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
            const { data } = await api_resource_upload_image(file)
            if(!data){
                openErrorMessageBox('错误', '请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.src = data['data']['extra']
                    this.$emit('change', data['data']['id'])
                }
            }
        }
    }
}
</script>

<style lang="scss">
.irina-upload-img-default {
    .v-image__image {
        background-image: url('../../assets/upload_default.jpg');
    }

    .v-responsive__content {
        background-image: url('../../assets/upload_default.jpg');
        background-size: cover;
        background-position: center;
    }
}

.irina-upload-img {
    .cover {
            background-color: rgba(0, 0, 0, 0.2);
            color: white;
            font-size: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
    }
}
</style>