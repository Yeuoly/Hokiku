const AcmAdminIndex = () => import('../views/acm/admin/Index.vue')
const AcmAdminProblem = () => import('../views/acm/admin/Problem.vue')
const AcmAdminCommits = () => import('../views/acm/admin/Commit.vue')
const AcmAdminEditProblem = () => import('../views/acm/admin/EditProblem.vue')
const AcmAdminExam = () => import('../views/acm/admin/Exam.vue')
const AcmAdminEditExam = () => import('../views/acm/admin/EditExam.vue')

const AcmUserIndex = () => import('../views/acm/user/Index.vue')
const AcmUserProblem = () => import('../views/acm/user/Problem.vue')
const AcmUserExam = () => import('../views/acm/user/Exam.vue')
const AcmUserHome = () => import('../views/acm/user/Home.vue')
const AcmUserProblemDetail = () => import('../views/acm/user/Detail.vue')
const AcmUserExamProblem = () => import('../views/acm/user/ExamProblems.vue')
const AcmUserExamStatistics = () => import('../views/acm/admin/ExamDetail.vue')

export const acm_pages = [{
    name : 'acm-admin',
    path : '/acm/admin',
    component : AcmAdminIndex,
    children : [{
        name : 'acm-admin-problem',
        path : '/acm/admin/problem',
        component : AcmAdminProblem
    }, {
        name : 'acm-admin-exam',
        path : '/acm/admin/exam',
        component : AcmAdminExam
    }, {
        name : 'acm-admin-edit-problem',
        path : '/acm/admin/edit-problem/:pid',
        component : AcmAdminEditProblem
    }, {
        name : 'acm-admin-edit-exam',
        path : '/acm/admin/edit-exam/:eid',
        component : AcmAdminEditExam
    }, {
        name : 'acm-admin-commit',
        path : '/acm/admin/commit/:pid',
        component : AcmAdminCommits
    }, {
        path : '/acm/admin/',
        redirect : '/acm/admin/problem'
    }]
}, {
    name : 'acm-user',
    path : '/acm/user',
    component : AcmUserIndex,
    children : [{
            name : 'acm-user-problem',
            path : '/acm/user/problem',
            component : AcmUserProblem
        }, {
            name : 'acm-user-home',
            path : '/acm/user/home',
            component : AcmUserHome
        }, {
            name : 'acm-user-problem-detail',
            path : '/acm/user/problem/detail/:pid',
            component : AcmUserProblemDetail
        }, {
            name : 'acm-user-exam',
            path : '/acm/user/exam',
            component : AcmUserExam
        }, {
            name : 'acm-user-exam-problem',
            path : '/acm/user/exam_problem/:exam_id',
            component : AcmUserExamProblem
        }, {
            name : 'acm-admin-exam-staistics',
            path : '/acm/admin/exam_staistics/:exam_id',
            component : AcmUserExamStatistics
        },{
            path : '/acm/',
            redirect : '/acm/user/home'
        }]
}, ]