export const teacher_service = [{
    path : '/teacher/service/:gid/questions',
    name : 'teacher-service-list',
    component : () => import('@/views/teacher/ServiceList.vue'),
}, {
    path : '/teacher/service/:gid/:sid/editor',
    name : 'teacher-service-editor',
    component : () => import('@/views/teacher/ServiceEditor.vue'),
}]