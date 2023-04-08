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
    name : 'admin-docker',
    path : '/admin/docker',
    component : AdminDocker
}, {
    name : 'admin-boardcast',
    path : '/admin/boardcast',
    component : AdminBoardcast
}, {
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