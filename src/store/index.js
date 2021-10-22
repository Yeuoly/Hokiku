import Vue from 'vue'
import Vuex from 'vuex'

import userinfo from './user'
import competition from './competition'

import AsyncLoading from 'async_loading'
import { api_competition_train_list_user } from '../interface/api'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules : {
        userinfo,
        competition
    }
})

export default store


//下面注册缓存加载组建
class CompetitionLoading extends AsyncLoading {
    store(key, comp){
        store.commit('pushCompetitions', [key, comp])
    }

    data(key){
        return store.getters.getCompetitions(key)
    }

    exist(key){
        return store.getters.getCompetitions(key)
    }

    async load(key, resolve, reject){
        const split = key.split(/-/g)
        const type = parseInt(split[0])
        const page = parseInt(split[1])
        const { data } = await api_competition_train_list_user(page, 32, type)
        if(!data){
            reject('网络错误')
        }else{
            if(data['res'] != 0){
                reject(data['err'])
            }else{
                resolve(data)
            }
        }
    }
}

const compeittion_loader = new CompetitionLoading(false)

export const loadCompetitions = (type, page) => {
    return compeittion_loader.get(`${type}-${page}`)
}