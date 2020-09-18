import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    docs: Array,
    challenges: Array,
    users: Array,
    currentDataSet: Object
  },
  mutations: {
    populateDocs(state, arr) {
      state.docs = arr
    },
    populateChallenges(state, arr) {
      state.challenges = arr
    },
    populateUsers(state, arr) {
      state.users = arr
    },
    setCurrentDataSet(state, obj) {
      state.currentDataSet = obj
    }
  },
  actions: {
    commitDocs(context, arr) {
      context.commit("populateDocs", arr)
    },
    commitChallenges(context, arr) {
      context.commit("populateChallenges", arr)
    },
    commitUsers(context, arr) {
      context.commit("populateUsers", arr)
    },
    commitCurrentDataSet(context, obj) {
      context.commit("setCurrentDataSet", obj)
    }
  },
  modules: {
  }
})
