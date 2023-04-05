export default [{
    path: '/admin/course/edit/:course_id',
    name: 'course_edit',
    component: () => import('@/views/knowledge/EditCourse.vue'),
    meta: {}
}, {
    path: '/admin/course-unit/edit/:course_id',
    name: 'course_unit_edit',
    component: () => import('@/views/knowledge/EditUnit.vue'),
}, {
    path: '/admin/course-sheet',
    name: 'admin_course_sheet',
    component: () => import('@/views/admin/CourseSheet.vue'),
}]