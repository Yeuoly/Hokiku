export const redirect_pages = [{
    name: 'blog-redirection',
    path: '/blog/space',
    redirect: '/blog/space/0',
    meta: {}
},{
    path: '*',
    redirect: '/index',
    meta: {
        inNav: false,
        required: {
            online: false
        }
    },
}, ]