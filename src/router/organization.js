export const organization_routes = [{
    name: 'organization-train',
    path: '/org/train/:gid',
    component: () => import('../views/organization/Train.vue'),
}, {
    name: 'organization-train-sheet',
    path: '/org/sheet/:gid',
    component: () => import('../views/organization/Sheet.vue'),
}, {
    name: 'organization-train-sheet-detail',
    path: '/org/sheet/:gid/:sid',
    component: () => import('../views/organization/SheetTrain.vue'),
}, {
    name: 'organization-course',
    path: '/org/course/:gid',
    component: () => import('../views/organization/Course.vue'),
}, {
    name: 'organization-train-sheet-rank',
    path: '/org/sheet/:gid/:sid/rank',
    component: () => import('../views/organization/SheetRank.vue'),
}, {
    name : 'organization-service',
    path : '/org/service/:gid',
    component : () => import('../views/organization/Service.vue'),
}, {
    name : 'organization-awd',
    path : '/org/awd/:gid',
    component : () => import('../views/organization/Awd.vue'),
}]