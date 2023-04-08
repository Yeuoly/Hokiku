const CompetitionGame = () => import('../views/game/Index.vue')
const CompetitionGameManager = () => import('../views/game/Manager.vue')
const CompetitionManager = () => import('../views/competition/Manager.vue')
const CompetitionTrain = () => import('../views/competition/Train.vue')
const CompetitionRank = () => import('../views/competition/Rank.vue')
const CompetitionHome = () => import('../views/competition/Home.vue')
const CompetitionTrainSolved = () => import('../views/competition/TrainSolved.vue')
const CompetitionTrainNote = () => import('../views/competition/Note.vue')
const CompetitionGameEditor = () => import('../views/game/Editor.vue')
const AwdGameList = () => import('../views/awd/List.vue')


export const competition_pages = [{
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
    name : 'competition-awd',
    path : '/competition/awd',
    component : AwdGameList,
}, {
    path : '/competition/',
    redirect : '/competition/game'
}]