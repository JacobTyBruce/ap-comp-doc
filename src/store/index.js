import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    docs: Array,
    challenges: Array,
    users: Array,
    posts: Array,
    currentDataSet: Object,
    loggedIn: Boolean,
    userAccount: Object,
    errorState: false,
    error: String
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
    populatePosts(state, arr) {
      state.posts = arr
    },
    setCurrentDataSet(state, obj) {
      state.currentDataSet = obj
    },
    setLoggedIn(state, bool) {
      state.loggedIn = bool
    },
    setUserAccount(state, obj) {
      state.userAccount = obj
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
    commitPosts(context, arr) {
      context.commit("populatePosts", arr)
    },
    commitCurrentDataSet(context, obj) {
      context.commit("setCurrentDataSet", obj)
    },
    commitLoggedIn(context, bool) {
      context.commit("setLoggedIn", bool)
    },
    commitUserAccount(context, obj) {
      context.commit("setUserAccount", obj)
    }
  },
  modules: {
  }
})
