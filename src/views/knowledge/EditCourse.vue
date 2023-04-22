<template>
    <v-container class="irina-edit-course">
        <v-row>
            <v-col :cols="6">
                <v-card>
                    <v-card-title>
                        <span class="headline">课程基础信息</span>
                    </v-card-title>
                    <v-img 
                        :height="250" 
                        :src="course.cover_url"
                        class="clickable cover"
                    >
                        <div class="cover-text"
                            @click="openUploadCoverDialog"
                        >更换封面</div>
                    </v-img>
                    <p></p>
                    <v-text-field
                        v-model="course.title"
                        label="课程名称"
                    ></v-text-field>
                    <v-textarea
                        v-model="course.desc"
                        label="课程描述"
                    ></v-textarea>
                    <v-checkbox
                        v-model="course.is_public"
                        label="公开课程 - 公开课程将会在公共课程列表中展示"
                    ></v-checkbox>
                    <v-btn color="primary" @click="updateCourse">更新</v-btn>
                </v-card>
            </v-col>
            <v-col :cols="6">
                <v-card-title>
                    <span class="headline">课程章节</span>
                </v-card-title>
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">单元名称</th>
                                <th class="text-left">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(unit, index) in units" :key="index">
                                <td>{{ unit.title }}</td>
                                <td>
                                    <v-btn
                                        color="primary"
                                        text
                                        @click="editUnit(unit)"
                                    >
                                        编辑
                                    </v-btn>
                                    <v-btn
                                        color="error"
                                        text
                                        @click="deleteUnit(unit)"
                                    >
                                        删除
                                    </v-btn>
                                    <v-btn
                                        color="success"
                                        text
                                        @click="checkChallenge(unit)"
                                    >
                                        习题检查
                                    </v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
            <v-col :cols="12">
                <v-divider class="mt5"></v-divider>
                <v-card>
                    <v-card-title>
                        <span class="headline">关联班级</span>
                    </v-card-title>
                    <v-card-text>
                        <ul>
                            <li>关联班级即将该课程绑定到某一或某几个班级上</li>
                            <li>若课程未公开，则无法通过公共课程列表订阅该课程</li>
                            <li>关联到班级以后该班级的学生将有权订阅课程</li>
                        </ul>
                        <v-data-table
                            :headers="bind_header"
                            :items="bind"
                        >
                            <template v-slot:item.binded="{ item }">
                                <v-checkbox
                                    v-model="item.binded"
                                    disabled
                                ></v-checkbox>
                            </template>
                            <template v-slot:item.action="{ item }">
                                <v-btn
                                    color="primary"
                                    text
                                    @click="bindOrganization(item.organization_id)"
                                    :disabled="item.binded"
                                >
                                    绑定
                                </v-btn>
                                <v-btn
                                    color="red"
                                    text
                                    @click="unbindOrganization(item.organization_id)"
                                    :disabled="!item.binded"
                                >
                                    解绑
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog.upload_cover" :width="500">
            <v-card>
                <UploadImage
                    :height="250"
                    v-model="course.cover_rid"
                />
                <v-card-actions>
                    <v-btn @click="updateCourse" color="primary">确定</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import UploadImage from '../../components/common/UploadImage.vue'
import { openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus'
import {
    api_course_detail,
    api_course_get,
    api_course_update
} from '../../interface/api'
import {
    api_organization_manage_course_bind,
    api_organization_manage_course_bind_list,
    api_organization_manage_course_unbind
} from '../../interface/organization'

export default {
    components : { UploadImage },
    data : () => ({
        bind_header : [
            { text : '是否绑定', value : 'binded' },
            { text : '班级ID', value : 'organization_id' },
            { text : '班级名称', value : 'organization_name' },
            { text : '操作', value : 'action' }
        ],
        dialog : {
            upload_cover : false  
        },
        course_id : 0,
        course : {
            title : '',
            desc : '',
            cover_rid : 0,
            cover_url : '',
            is_public : false
        },
        units : [],
        bind : []
    }),
    methods : {
        async bindOrganization(organization_id) {
            const { data } = await api_organization_manage_course_bind(this.course_id, organization_id)
            if(!data){
                openErrorSnackbar('请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    openSuccessSnackbar('绑定成功')
                    this.getOrganizationBind()
                }
            }
        },
        async unbindOrganization(organization_id) {
            const { data } = await api_organization_manage_course_unbind(this.course_id, organization_id)
            if(!data){
                openErrorSnackbar('请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    openSuccessSnackbar('解绑成功')
                    this.getOrganizationBind()
                }
            }
        },
        async getOrganizationBind() {
            const { data } = await api_organization_manage_course_bind_list(this.course_id)
            if(!data){
                openErrorSnackbar('请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.bind = data['data']['list']
                }
            }
        },
        async getCourseDetail() {
            const { data } = await api_course_detail(this.course_id)
            if(!data){
                openErrorSnackbar('请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.units = data['data']['units']
                }
            }
        },
        async getCourse() {
            const { data } = await api_course_get(this.course_id)
            if(!data){
                openErrorSnackbar('请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    this.course.title = data['data']['title']
                    this.course.desc = data['data']['desc']
                    this.course.cover_rid = data['data']['cover_rid']
                    this.course.cover_url = data['data']['r_cover']['url']
                    this.course.is_public = (data['data']['flag'] & 2) == 2
                }
            }
        },
        async updateCourse() {
            const { data } = await api_course_update(
                this.course_id,
                this.course.title,
                this.course.desc,
                this.course.cover_rid,
                this.course.is_public
            )
            if(!data){
                openErrorSnackbar('请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    openSuccessSnackbar('更新成功')
                    this.dialog.upload_cover = false
                    this.getCourse()
                }
            }
        },
        async editUnit() {
            this.$router.push(`/admin/course-unit/edit/${this.course_id}`)
        },
        async deleteUnit(item) {
            console.log(item)
        },
        openUploadCoverDialog() {
            this.dialog.upload_cover = true
        },
        checkChallenge(item) {
            this.$router.push(`/knowledge/course/challenge/check/${item.id}`)
        }
    },
    mounted() {
        this.course_id = parseInt(this.$route.params.course_id)
        if (this.course_id) {
            this.getCourseDetail()
            this.getCourse()
            this.getOrganizationBind()
        } else {
            this.$router.back()
        }
    }
}
</script>

<style lang="scss">
.irina-edit-course {
    .cover {
        cursor: pointer;
    }

    .cover-text {
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 25px;
    }
}
</style>