export const state_user = {
    online : false,
    username : '游客',
    email : String(),
    uid : Number(),
    status : Number(),
    powers : Number(),
    login_time : Number()
};

export default {
    state : state_user,
    mutations : {
        setOnlineState(state,val){
            state.online = val;
        },
        setUsername(state,name){
            state.username = name;
        },
        setUserUid(state,powers){
            state.uid = powers;
        },
        setUserPowers(state,powers){
            state.powers = powers;
        },
        setLoginTime(state,loginTime){
            state.login_time = loginTime;
        },
        setUserStatus(state,status){
            state.status = status;
        },
        setUserEmail(state,email){
            state.email = email;
        }
    },
    getters : {
        getUserName(state){
            return state.username;
        },
        getUserOnlineState(state){
            return state.online;
        },
        getUserUid(state){
            return state.uid;
        },
        getUserStatus(state){
            return state.status;
        },
        getUserPowers(state){
            return state.powers;
        },
        getUserLoginTime(state){
            return state.login_time;
        },
        getUserEmail(state){
            return state.email;
        }
    },
}