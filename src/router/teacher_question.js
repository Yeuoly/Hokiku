export const teacher_question = [{
    path : '/teacher/question/:gid/build',
    name : 'teacher-train-build',
    component : () => import('@/views/teacher/BuildImage.vue'),
}, {
    path : '/teacher/question/:gid/images',
    name : 'teacher-train-images',
    component : () => import('@/views/teacher/ImageList.vue'),
}, {
    path : '/teacher/question/:gid/question',
    name : 'teacher-train',
    component : () => import('@/views/teacher/Train.vue'),
}, {
    path : '/teacher/question/:gid/sheet',
    name : 'teacher-train-sheet',
    component : () => import('@/views/teacher/TrainSheet.vue'),
}, {
    path : '/teacher/question/:gid/sheet/:sid/editor',
    name : 'teacher-train-sheet-editor',
    component : () => import('@/views/teacher/TrainSheetEditor.vue'),
}]