import Cookies from 'js-cookie'

const state = {
  languageTag: Cookies.get('language')
}

const mutations = {
  SET_LANGUAGE: (state, language) => {
    state.languageTag = language
  }
}

const actions = {
  changeLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
