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

const AdminCourse = () => import('../views/admin/Course.vue')
const AdminServer = () => import('../views/admin/Server.vue')
const AdminDocker = () => import('../views/admin/Docker.vue')
const AdminTrade = () => import('../views/admin/Trade.vue')

const AdminTradeCoins = () => import('../views/admin/trade/Coins.vue')

const MessageSystem = () => import('../views/message/System.vue')

const CollectionInfo = () => import('../views/collections/CollectionInfo.vue')
const CollectionIndex = () => import('../views/collections/CollectionIndex.vue')
const CollectionPublish = () => import('../views/collections/CollectionPublish.vue')
const CollectionStatistics = () => import('../views/collections/CollectionStatistics.vue')

const HomeHomework = () => import('../views/home/Homework.vue')
const HomeCollection = () => import('../views/home/Collection.vue')
const HomeProfile = () => import('../views/home/Profile.vue')
const HomeOrganization = () => import('../views/home/Organization.vue')
const HomeTrade = () => import('../views/home/Trade.vue')

const HomeTradeCoins = () => import('../views/home/trade/Coins.vue')
const HomeTradeCharge = () => import('../views/home/trade/Charge.vue')

const CompetitionIndex = () => import('../views/competition/Index.vue')
const CompetitionGame = () => import('../views/game/Index.vue')
const CompetitionGameManager = () => import('../views/game/Manager.vue')
const CompetitionManager = () => import('../views/competition/Manager.vue')
const CompetitionTrain = () => import('../views/competition/Train.vue')
const CompetitionRank = () => import('../views/competition/Rank.vue')
const CompetitionHome = () => import('../views/competition/Home.vue')
const CompetitionTrainSolved = () => import('../views/competition/TrainSolved.vue')
const CompetitionTrainNote = () => import('../views/competition/Note.vue')
const CompetitionGameEditor = () => import('../views/game/Editor.vue')
const CompetitionGameDetail = () => import('../views/game/Detail.vue')

const AcmIndex = () => import('../views/acm/Index.vue')
const AcmAdminIndex = () => import('../views/acm/admin/Index.vue')
const AcmAdminProblem = () => import('../views/acm/admin/Problem.vue')
const AcmAdminCommits = () => import('../views/acm/admin/Commit.vue')
const AcmAdminEditProblem = () => import('../views/acm/admin/EditProblem.vue')

const AcmUserIndex = () => import('../views/acm/user/Index.vue')
const AcmUserProblem = () => import('../views/acm/user/Problem.vue')
const AcmUserHome = () => import('../views/acm/user/Home.vue')
const AcmUserProblemDetail = () => import('../views/acm/user/Detail.vue')

const KnowledgeMine = () => import('../views/knowledge/Mine.vue')
const KnowledgePublic = () => import('../views/knowledge/Public.vue')
const KnowledgeCourse = () => import('../views/knowledge/Course.vue')

const ToolsIndex = () => import('../views/tools/Index.vue')
const ToolsRoutes = () => import('../views/tools/Routes.vue')
const ToolsKurumi = () => import('../views/tools/Kurumi.vue')
const ToolsBaseSerial = () => import('../views/tools/BaseSerial.vue')
const ToolsHex = () => import('../views/tools/Hex.vue')
const Tools01 = () => import('../views/tools/01.vue')
const ToolsUrl = () => import('../views/tools/Url.vue')
const ToolsMorse = () => import('../views/tools/Morse.vue')

const admin_pages = [{
    name : 'admin-course',
    path : '/admin/course',
    component : AdminCourse
}, {
    name : 'admin-server',
    path : '/admin/server',
    component : AdminServer
}, {
    name : 'admin-docker',
    path : '/admin/docker',
    component : AdminDocker
}, {
    name : 'admin-trade',
    path : '/admin/trade',
    component : AdminTrade,
    children : [{
        name : 'admin-trade-coins',
        path : '/admin/trade/coins',
        component : AdminTradeCoins
    }, {
        path : '/admin/trade/',
        redirect : '/admin/trade/coins'
    }]
}, {
    path : '/admin/',
    redirect : '/admin/server'
}]

const knowledge_pages = [{
    name : 'knowledge-mine',
    path : '/knowledge/mine',
    component : KnowledgeMine
}, {
    name : 'knowledge-public',
    path : '/knowledge/public',
    component : KnowledgePublic
}, {
    name : 'knowledge-course',
    path : '/knowledge/course/:cid',
    component : KnowledgeCourse
}, {
    path : '/knowledge/',
    redirect : '/knowledge/public'
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
    name : 'home-trade',
    path : '/home/trade',
    component : HomeTrade,
    children : [{
        name : 'home-trade-coins',
        path : '/home/trade/coins',
        component : HomeTradeCoins
    }, {
        name : 'home-trade-charge',
        path : '/home/trade/charge',
        component : HomeTradeCharge
    }, {
        path : '/home/trade/',
        redirect : '/home/trade/coins'
    }]
},{
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
    name : 'competition-game-manager',
    path : '/competition/game/manager',
    component : CompetitionGameManager
}, {
    name : 'competition-train-solved',
    path : '/competition/train/solved/:train_id',
    component : CompetitionTrainSolved
}, {
    name : 'competition-train-note',
    path : '/competition/train/note/:train_id',
    component : CompetitionTrainNote
}, {
    name : 'competition-game-edit',
    path : '/competition/game/edit/:competition_id',
    component : CompetitionGameEditor
}, {
    path : '/competition/',
    redirect : '/competition/game'
}]

const acm_pages = [{
    name : 'acm-admin',
    path : '/acm/admin',
    component : AcmAdminIndex,
    children : [{
        name : 'acm-admin-problem',
        path : '/acm/admin/problem',
        component : AcmAdminProblem
    }, {
        name : 'acm-admin-edit-problem',
        path : '/acm/admin/edit-problem/:pid',
        component : AcmAdminEditProblem
    }, {
        name : 'acm-admin-commit',
        path : '/acm/admin/commit/:pid',
        component : AcmAdminCommits
    }, {
        path : '/acm/admin/',
        redirect : '/acm/admin/problem'
    }]
}, {
    name : 'acm-user',
    path : '/acm/user',
    component : AcmUserIndex,
    children : [{
            name : 'acm-user-problem',
            path : '/acm/user/problem',
            component : AcmUserProblem
        }, {
            name : 'acm-user-home',
            path : '/acm/user/home',
            component : AcmUserHome
        }, {
            name : 'acm-user-problem-detail',
            path : '/acm/user/problem/detail/:pid',
            component : AcmUserProblemDetail
        }, {
            path : '/acm/',
            redirect : '/acm/user/home'
        }]
}, ]

const tools_pages = [{
    name : 'tools-routes',
    path : '/tools/routes',
    component : ToolsRoutes
}, {
    name : 'tools-kurumi',
    path : '/tools/kurumi',
    component : ToolsKurumi
}, {
    name : 'tools-baseserial',
    path : '/tools/baseserial',
    component : ToolsBaseSerial
}, {
    name : 'tools-hex',
    path : '/tools/hex',
    component : ToolsHex
}, {
    name : 'tools-01',
    path : '/tools/01',
    component : Tools01
}, {
    name : 'tools-url',
    path : '/tools/url',
    component : ToolsUrl
}, {
    name : 'tools-morse',
    path : '/tools/morse',
    component : ToolsMorse
}, {
    path : '/tools/',
    redirect : '/tools/routes'
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
    },
    redirect : '/about'
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
        title : '收集',
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
        icon : 'mdi-flag-outline',
        title : 'CTF(Capture The Flag)',
        required : {
            online : true
        }
    },
    children : competition_pages
}, {
    name : 'acm',
    path : '/acm',
    component : AcmIndex,
    meta : {
        inNav : true,
        icon : 'mdi-microsoft-visual-studio-code',
        title : 'OJ(Open Judge)',
        required : {
            online : true
        }
    },
    children : acm_pages
}, {
    name : '安全工具',
    path : '/tools',
    component : ToolsIndex,
    meta : {
        inNav : true,
        icon : 'mdi-security',
        title : '安全工具',
        required : {
            online : true
        }
    },
    children : tools_pages
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
}, {
    name : 'admin',
    path : '/admin',
    component : Admin,
    meta : {
        inNav : true,
        icon : 'mdi-shield-crown-outline',
        title : '后台管理',
        required : {
            online : true,
            teacher : true
        }
    },
    children : admin_pages
}, {
    name : 'about',
    path : '/about',
    component : About,
    meta : {
        inNav : true,
        icon : 'mdi-information-outline',
        title : '关于',
        required : {
            online : false,
            teacher : false
        }
    }
}, {
    name : 'game-detail',
    path : '/game/detail/:competition_id',
    component : CompetitionGameDetail,
    meta : {
        inNav : false,
        required : {
            online : false,
            teacher : false
        }
    }
}, {
    path : '*',
    redirect : '/about',
    meta : {
        inNav : false,
        required : {
            online : false
        }
    },
}]