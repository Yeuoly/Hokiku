const AwdGameEditor = () => import('../views/awd/Editor.vue')
const AwdGameAdmin = () => import('../views/awd/Admin.vue')
const AwdGameList = () => import('../views/awd/List.vue')
const AwdGameSenso = () => import('../views/awd/Senso.vue')
const AwdGameMonitor = () => import('../views/awd/Monitor.vue')
const AwdGameTeamDetail = () => import('../views/awd/TeamDetail.vue')

export const awd_pages = [{
    name : 'awd-editor',
    path : '/awd/editor/:game_id',
    component : AwdGameEditor,
}, {
    name : 'awd-admin',
    path : '/awd/admin',
    component : AwdGameAdmin,
}, {
    name :' awd-list',
    path : '/awd/list',
    component : AwdGameList,
}, {
    name : 'awd-senso',
    path : '/awd/senso/:game_id',
    component : AwdGameSenso,
}, {
    name : 'awd-monitor',
    path : '/awd/monitor/:game_id',
    component : AwdGameMonitor,
}, {
    name : 'awd-team-detail',
    path : '/awd/team/:game_id/',
    component : AwdGameTeamDetail,
}, {
    name : 'awd-index',
    path : '/awd/',
    redirect : '/awd/list'
}]