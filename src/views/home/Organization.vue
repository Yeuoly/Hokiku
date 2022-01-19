<template>
    <v-row class="px5 py5">
        <v-dialog v-model="dialog.open" width="500">
            <v-card class="px5 py5">
                <v-text-field
                    label="组织名"
                    v-model="dialog.org_name"
                    placeholder="组织名"
                ></v-text-field>
                <v-textarea
                    label="简介"
                    v-model="dialog.org_desc"
                    placeholder="简介"
                ></v-textarea>
                <v-btn color="primary" @click="commitOrganization">提交申请</v-btn>
            </v-card>
        </v-dialog>
        <v-col :cols="12">
            <v-btn @click="createOrganization" color="primary">创建新组织</v-btn>
        </v-col>
    </v-row>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { api_organization_new } from '../../interface/api'
export default {
    data : () => ({
        dialog : {
            open : false,
            org_name : '',
            org_desc : ''
        }
    }),
    methods : {
        createOrganization(){
            this.dialog.open = true
        },
        async commitOrganization(){
            const { data } = await api_organization_new(
                this.dialog.org_name,
                this.dialog.org_desc
            )

            if(!data){
                openErrorMessageBox('失败', '请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('失败', data['err'])
                }else{
                    openInfoMessageBox('成功', '创建成功')
                }
            }
        }
    }
}
</script>

<style>

</style>