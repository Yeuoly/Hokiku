const HomeHomework = () => import('../views/home/Homework.vue')
const HomeCollection = () => import('../views/home/Collection.vue')
const HomeProfile = () => import('../views/home/Profile.vue')
const HomeOrganization = () => import('../views/home/Organization.vue')
const HomeTrade = () => import('../views/home/Trade.vue')
const HomeSignin = () => import('../views/home/Signin.vue')

const HomeTradeCoins = () => import('../views/home/trade/Coins.vue')
const HomeTradeCharge = () => import('../views/home/trade/Charge.vue')

export const home_pages = [{
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
    name : 'home-signin',
    path : '/home/signin',
    component : HomeSignin
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