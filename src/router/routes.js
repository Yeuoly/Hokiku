const Index = () => import('../views/Index.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Home = () => import('../views/Home.vue')
const Homeworks = () => import('../views/Homeworks.vue')
const Homework = () => import('../views/Homework.vue')
const TeacherTerminal = () => import('../views/TeacherTerminal.vue')
const CollectionInfo = () => import('../views/collections/CollectionInfo.vue')
const CollectionIndex = () => import('../views/collections/CollectionIndex.vue')
const CollectionPublish = () => import('../views/collections/CollectionPublish.vue')
const CollectionStatistics = () => import('../views/collections/CollectionStatistics.vue')

const collection_pages = [{
    name : 'collection-info',
    path : '/coll/info/:cid',
    component : CollectionInfo,
    meta : {
        disableHeader : true,
        disableSideMenu : true
    }
}, {
    name : 'collection-publish',
    path : '/coll/publish',
    component : CollectionPublish,
}, {
    name : 'collection-statistics',
    path : '/coll/statistics/:cid',
    component : CollectionStatistics
}]

export default [{
    name : 'home',
    path : '/home',
    component : Home,
    meta : {
        inNav : true,
        icon : 'mdi-heart-settings-outline',
        title : '个人中心',
        required : {
            online : true
        }
    },
},{
    name : 'homeworks',
    path : '/homeworks',
    component : Homeworks,
    meta : {
        inNav : true,
        icon : 'mdi-calendar-check-outline',
        title : '作业',
        required : {
            online : true
        }
    }
},{
    name : 'homework',
    path : '/homework/:hid',
    component : Homework,
    meta : {
        inNav : false,
        required : {
            online : true
        }
    }
},{
    name : 'teacher-terminal',
    path : '/teacher-terminal',
    component : TeacherTerminal,
    meta : {
        inNav : true,
        icon : 'mdi-console-line',
        title : '教师后台',
        required : {
            online : true,
            teacher : true
        }
    }
},{
    name : 'index',
    path : '/',
    component : Index,
    meta : {
        inNav : true,
        icon : 'mdi-home-circle-outline',
        title : '主页',
        required : {

        }
    }
}, {
    name : 'login',
    path : '/login',
    component : Login,
    meta : {
        inNav : true,
        icon : 'mdi-login-variant',
        title : '登录',
        required : {
            offline : true
        }
    },
}, {
    name : 'reg',
    path : '/reg',
    component : Register,
    meta : {
        inNav : true,
        icon : 'mdi-account-plus-outline',
        title : '注册',
        required : {
            offline : true
        }
    }
}, {
    name : 'collection-index',
    path : 'coll',
    component : CollectionIndex,
    meta : {
        inNav : true,
        icon : 'mdi-account-plus-outline',
        title : '事件',
        required : {
            offline : true
        }
    },
    children : collection_pages
}]