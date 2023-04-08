export default [{
    path: '/teacher/publish-homework',
    name: 'publish-homework',
    component: () => import('@/views/teacher/PublishHomework.vue'),
    meta: {}
}, {
    path: '/teacher/check-homework',
    name: 'check-homework',
    component: () => import('@/views/teacher/Homeworks.vue'),
}, {
    path: '/teacher/publish-coll',
    name: 'publish-coll',
    component: () => import('@/views/teacher/PublishColl.vue'),
}, {
    path: '/teacher/publish-course',
    name: 'publish-course',
    component: () => import('@/views/teacher/PublishCourse.vue'),
}, {
    path: '/teacher/courses',
    name: 'teacher-courses',
    component: () => import('@/views/teacher/Courses.vue'),
}, {
    path: '/teacher/course/sheet',
    name: 'teacher-sheet',
    component: () => import('@/views/teacher/CourseSheet.vue'),
}, {
    path: '/teacher/course/sheet/edit/:sheet_id',
    name: 'teacher-sheet-edit',
    component: () => import('@/views/teacher/CourseSheetEdit.vue'),
}, {
    path: '/teacher/monitor/members/living/:gid',
    name: 'teacher-monitor-members-living',
    component: () => import('@/views/teacher/MembersLivingContinus.vue'),
}, {
    path: '/teacher/monitor/members/train-check/:gid',
    name: 'teacher-monitor-members-train-check',
    component: () => import('@/views/teacher/CheckTrainCommit.vue'),
}, {
    path: '/teacher/',
    redirect: '/teacher/publish-homework'
}]