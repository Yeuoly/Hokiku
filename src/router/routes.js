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

const MessageSystem = () => import('../views/message/System.vue')

const CollectionInfo = () => import('../views/collections/CollectionInfo.vue')
const CollectionIndex = () => import('../views/collections/CollectionIndex.vue')
const CollectionPublish = () => import('../views/collections/CollectionPublish.vue')
const CollectionStatistics = () => import('../views/collections/CollectionStatistics.vue')

const HomeHomework = () => import('../views/home/Homework.vue')
const HomeCollection = () => import('../views/home/Collection.vue')
const HomeProfile = () => import('../views/home/Profile.vue')
const HomeOrganization = () => import('../views/home/Organization.vue')

const CompetitionIndex = () => import('../views/competition/Index.vue')
const CompetitionGame = () => import('../views/competition/Game.vue')
const CompetitionManager = () => import('../views/competition/Manager.vue')
const CompetitionTrain = () => import('../views/competition/Train.vue')
const CompetitionRank = () => import('../views/competition/Rank.vue')
const CompetitionHome = () => import('../views/competition/Home.vue')

const KnowledgeMine = () => import('../views/knowledge/Mine.vue')
const KnowledgePublic = () => import('../views/knowledge/Public.vue')

const knowledge_pages = [{
    name : 'knowledge-mine',
    path : '/knowledge/mine',
    component : KnowledgeMine
}, {
    name : 'knowledge-public',
    path : '/knowledge/public',
    component : KnowledgePublic
}, {
    path : '/knowledge/',
    redirect : '/knowledge/mine'
}]

const message_pages = [{
    name : 'message-system',
    path : '/message/system',
    component : MessageSystem,
}, {
    path : '/message/',
    redirect : '/message/system'
}]

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

const home_pages = [{
    name : 'home-homework',
    path : '/home/homework',
    component : HomeHomework,
}, {
    name : 'home-collection',
    path : '/home/collection',
    component : HomeCollection
}, {
    name : 'home-profile',
    path : '/home/profile',
    component : HomeProfile
}, {
    name : 'home-organization',
    path : '/home/org',
    component : HomeOrganization
}, {
    path : '/home/',
    redirect : '/home/profile'
}]

const competition_pages = [{
    name : 'competition-game',
    path : '/competition/game',
    component : CompetitionGame
}, {
    name : 'competition-manager',
    path : '/competition/manager',
    component : CompetitionManager
}, {
    name : 'competition-train',
    path : '/competition/train',
    component : CompetitionTrain
}, {
    name : 'competition-rank',
    path : '/competition/rank',
    component : CompetitionRank
}, {
    name : 'competition-home',
    path : '/competition/home',
    component : CompetitionHome
}, {
    path : '/competition/',
    redirect : '/competition/train'
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
    children : home_pages
},{
    name : 'message',
    path : '/message',
    component : Message,
    meta : {
        inNav : true,
        icon : 'mdi-message-outline',
        title : '消息',
        required : {
            online : true
        }
    },
    children : message_pages
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
        inNav : false,
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
    path : '/coll',
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
}, {
    name : 'result',
    path : '/result/:text',
    component : ResultPage,
    meta : {
        inNav : false
    }
}, {
    name : 'competition',
    path : '/competition',
    component : CompetitionIndex,
    meta : {
        inNav : true,
        icon : 'mdi-fencing',
        title : '竞赛中心',
        required : {
            online : true
        }
    },
    children : competition_pages
}, {
    name : 'knowledge',
    path : '/knowledge',
    component : Knowledge,
    meta : {
        inNav : true,
        icon : 'mdi-book-outline',
        title : '学习中心',
        required : {
            online : true
        }
    },
    children : knowledge_pages
}, {
    name : 'homework-commits',
    path : '/homework/commits/:hid',
    component : HomeworkCommits,
    meta : {
        inNav : false,
        required : {
            online : true
        }
    },
    
}, ]