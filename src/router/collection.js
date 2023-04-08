const CollectionPublish = () => import('../views/collections/CollectionPublish.vue')
const CollectionStatistics = () => import('../views/collections/CollectionStatistics.vue')
const CollectionInfo = () => import('../views/collections/CollectionInfo.vue')

export const collection_pages = [{
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