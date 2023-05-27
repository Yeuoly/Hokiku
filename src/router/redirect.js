const Redirct = () => import ('@/views/redirect/Redirect.vue')

export const redirect_pages = [{
    name: 'blog-redirection',
    path: '/blog/space',
    redirect: '/blog/space/0',
    meta: {}
}, {
    name: 'redirection',
    path: '/redirect',
    component: Redirct,
}, {
    path: '*',
    redirect: '/index',
    meta: {
        inNav: false,
        required: {
            online: false
        }
    },
}, ]