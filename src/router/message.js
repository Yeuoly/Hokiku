const MessageSystem = () => import('../views/message/System.vue')

export const message_pages = [{
    name : 'message-system',
    path : '/message/system',
    component : MessageSystem,
}, {
    path : '/message/',
    redirect : '/message/system'
}]