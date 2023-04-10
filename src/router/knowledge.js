const KnowledgeMine = () => import('../views/knowledge/Mine.vue')
const KnowledgePublic = () => import('../views/knowledge/Public.vue')
const KnowledgeCourse = () => import('../views/knowledge/Course.vue')
const KnowledgeCourseSheet = () => import('../views/knowledge/Sheet.vue')
const KnowledgeCourseSheetDetail = () => import('../views/knowledge/SheetDetail.vue')
const KnowledgeCourseChallengeCheck = () => import('../views/knowledge/CourseChallengeCheck.vue')

export const knowledge_pages = [{
    name : 'knowledge-mine',
    path : '/knowledge/mine',
    component : KnowledgeMine
}, {
    name : 'knowledge-public',
    path : '/knowledge/public',
    component : KnowledgePublic
}, {
    name : 'knowledge-course',
    path : '/knowledge/course/:cid',
    component : KnowledgeCourse
}, {
    name : 'knowledge-course-sheet',
    path : '/knowledge/sheet',
    component : KnowledgeCourseSheet
}, {
    name : 'knowledge-course-sheet-detail',
    path : '/knowledge/course/sheet/:sheet_id',
    component : KnowledgeCourseSheetDetail
}, {
    name : 'knowledge-course-challenge-check',
    path : '/knowledge/course/challenge/check/:unit_id',
    component : KnowledgeCourseChallengeCheck
}, {
    path : '/knowledge/',
    redirect : '/knowledge/public'
}]
