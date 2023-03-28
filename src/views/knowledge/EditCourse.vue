<template>
    <v-container class="irina-edit-course">
        <v-row>
            <v-col :cols="6">
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
                <v-btn color="primary" @click="updateCourse">更新</v-btn>
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
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
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

export default {
    components : { UploadImage },
    data : () => ({
        dialog : {
            upload_cover : false  
        },
        course_id : 0,
        course : {
            title : '',
            desc : '',
            cover_rid : 0,
            cover_url : '',
        },
        units : []
    }),
    methods : {
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
                }
            }
        },
        async updateCourse() {
            const { data } = await api_course_update(
                this.course_id,
                this.course.title,
                this.course.desc,
                this.course.cover_rid
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
        }
    },
    mounted() {
        this.course_id = parseInt(this.$route.params.course_id)
        if (this.course_id) {
            this.getCourseDetail()
            this.getCourse()
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