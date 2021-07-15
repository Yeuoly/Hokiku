const Index = () => import('../views/Index.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Home = () => import('../views/Home.vue')


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
}]