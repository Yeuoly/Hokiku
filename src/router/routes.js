const Index = () => import('../views/Index.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Home = () => import('../views/Home.vue')
const Homework = () => import('../views/Homework.vue')
const TeacherTerminal = () => import('../views/TeacherTerminal.vue')
const ResultPage = () => import('../views/Result.vue')
const Message = () => import('../views/Message.vue')
const HomeworkCommits = () => import('../views/HomeworkCommits.vue')
const Knowledge = () => import('../views/Knowledge.vue')
const Admin = () => import('../views/Admin.vue')
const About = () => import('../views/About.vue')
const Repassword = () => import('../views/Repassword.vue')
const BigScreen = () => import('../views/BigScreen.vue')
const CollectionIndex = () => import('../views/collections/CollectionIndex.vue')
const CompetitionIndex = () => import('../views/competition/Index.vue')
const CompetitionGameDetail = () => import('../views/game/Detail.vue')
const AcmIndex = () => import('../views/acm/Index.vue')
const ToolsIndex = () => import('../views/tools/Index.vue')
const AwdGameIndex = () => import('../views/awd/Index.vue')
const BlogIndex = () => import('../views/blog/Index.vue')

import teacher from './teacher'
import { tools_pages } from './tool'
import { admin_pages } from './admin'
import { knowledge_pages } from './knowledge'
import { home_pages } from './home'
import { competition_pages } from './competition'
import { acm_pages } from './acm'
import { awd_pages } from './awd'
import { blog_pages } from './blog'
import { message_pages } from './message'
import { collection_pages } from './collection'
import { redirect_pages } from './redirect'
import { bigscreen_pages } from './bigscreen'

const generateRoute = (name, path, component, meta_in_nav, meta_icon, meta_title, meta_required_online, meta_required_teacher, meta_required_offline, children) => {
    return {
        name: name,
        path: path,
        component: component,
        meta: {
            inNav: meta_in_nav,
            icon: meta_icon,
            title: meta_title,
            required: {
                online: meta_required_online,
                offline: meta_required_offline,
                teacher: meta_required_teacher
            }
        },
        children: children
    }
}

export default [
    generateRoute('index', '/index', Index, true, 'mdi-home-circle-outline', '主页', false, false, false),
    generateRoute('home', '/home', Home, true, 'mdi-heart-settings-outline', '个人中心', true, false, false, home_pages),
    generateRoute('message', '/message', Message, true, 'mdi-message-outline', '消息', true, false, false, message_pages),
    generateRoute('homework', '/homework/:hid', Homework, false, '', '', true, false, false),
    generateRoute('teacher', '/teacher', TeacherTerminal, true, 'mdi-console-line', '教师后台', true, true, false, teacher),
    generateRoute('login', '/login', Login, true, 'mdi-login-variant', '登录', false, false, true),
    generateRoute('reg', '/reg', Register, true, 'mdi-account-plus-outline', '注册', false, false, true),
    generateRoute('collection-index', '/coll', CollectionIndex, false, 'mdi-account-plus-outline', '收集', true, false, false, collection_pages),
    generateRoute('result', '/result/:text', ResultPage, false, '', '', false, false, false),
    generateRoute('competition', '/competition', CompetitionIndex, true, 'mdi-flag-outline', 'CTF(Capture The Flag)', true, false, false, competition_pages),
    generateRoute('acm', '/acm', AcmIndex, true, 'mdi-microsoft-visual-studio-code', 'OJ(Open Judge)', true, false, false, acm_pages),
    generateRoute('tools', '/tools', ToolsIndex, true, 'mdi-security', '安全工具', false, false, false, tools_pages),
    generateRoute('knowledge', '/knowledge', Knowledge, true, 'mdi-book-outline', '学习中心', true, false, false, knowledge_pages),
    generateRoute('homework-commits', '/homework/commits/:hid', HomeworkCommits, false, '', '', true, false, false),
    generateRoute('admin', '/admin', Admin, true, 'mdi-shield-crown-outline', '后台管理', true, true, false, admin_pages),
    generateRoute('about', '/about', About, true, 'mdi-information-outline', '关于', false, false, false),
    generateRoute('game-detail', '/game/detail/:competition_id', CompetitionGameDetail, false, '', '', false, false, false),
    generateRoute('blog', '/blog', BlogIndex, true, 'mdi-book-open-page-variant-outline', '博客', false, false, false, blog_pages),
    generateRoute('awd', '/awd', AwdGameIndex, false, 'mdi-security', 'AWD', true, false, false, awd_pages),
    generateRoute('repassword', '/repassword', Repassword, false, '', '', false, false, false),
    generateRoute('bs', '/bs', BigScreen, false, '', '', true, false, false, bigscreen_pages),
    ...redirect_pages
]