import course_manager_routes from './course_manager'

const AdminCourse = () => import('../views/admin/Course.vue')
const AdminServer = () => import('../views/admin/Server.vue')
const AdminDocker = () => import('../views/admin/Docker.vue')
const AdminTrade = () => import('../views/admin/Trade.vue')
const AdminBoardcast = () => import('../views/admin/Boardcast.vue')

const AdminTradeCoins = () => import('../views/admin/trade/Coins.vue')

export const admin_pages = [
    ...course_manager_routes,
    {
    name : 'admin-course',
    path : '/admin/course',
    component : AdminCourse
}, {
    name : 'admin-server',
    path : '/admin/server',
    component : AdminServer
}, {
    name : 'admin-org',
    path : '/admin/org',
    component : () => import('../views/admin/Organization.vue')
}, {
    name : 'admin-docker',
    path : '/admin/docker',
    component : AdminDocker
}, {
    name : 'admin-boardcast',
    path : '/admin/boardcast',
    component : AdminBoardcast
}, {
    name : 'admin-user',
    path : '/admin/user',
    component : () => import('../views/admin/User.vue')
}, {
    name : 'admin-docker-build-image',
    path : '/admin/docker/build-image',
    component : () => import('../views/admin/BuildImage.vue')
}, {
    name : 'admin-docker-list-image',
    path : '/admin/docker/list-image',
    component : () => import('../views/admin/Images.vue')
},{
    name : 'admin-docker-edit-service',
    path : '/admin/docker/edit-service',
    component : () => import('../views/admin/EditService.vue')
},  {
    name : 'admin-trade',
    path : '/admin/trade',
    component : AdminTrade,
    children : [{
        name : 'admin-trade-coins',
        path : '/admin/trade/coins',
        component : AdminTradeCoins
    }, {
        path : '/admin/trade/',
        redirect : '/admin/trade/coins'
    }]
}, {
    path : '/admin/',
    redirect : '/admin/server'
}]