const BlogSpace = () => import('../views/blog/Space.vue')
const BlogCreate = () => import('../views/blog/Create.vue')
const BlogDetail = () => import('../views/blog/Detail.vue')

export const blog_pages = [{
    name : 'blog-space',
    path : '/blog/space/:uid',
    component : BlogSpace
}, {
    name : 'blog-edit',
    path : '/blog/edit/:id',
    component : BlogCreate
}, {
    path : '/blog/',
    redirect : '/blog/space/0'
}, {
    name : 'blog-detail',
    path : '/blog/detail/:id',
    component : BlogDetail
}]