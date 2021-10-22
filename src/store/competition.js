export const state_competition = {
    competitions : [],
};

export default {
    state : state_competition,
    mutations : {
        pushCompetitions(state, payload){
            const comp = payload[1]
            const key = payload[0]
            for(const i of state.competitions){
                if(i[0] == key){
                    return
                }
            }
            state.competitions.push([key, comp]);
        },
    },
    getters : {
        getCompetitions(state){
            return key => {
                for(const i of state.competitions){
                    if(i[0] == key){
                        return i[1]
                    }
                }
            }
        },
    },
}