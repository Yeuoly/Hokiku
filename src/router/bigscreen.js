const AwdGamePilot = () => import('../views/bs/BigScreen.vue')

export const bigscreen_pages = [{
    name: 'bs-awd',
    path: '/bs/awd/:game_id',
    component: AwdGamePilot,
}]