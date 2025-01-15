import { getBatchNo, setBatchNo, removeBatchNo } from '@/utils/localStorage'

const state = {
  batchNoTag: getBatchNo()
}

const mutations = {
  SET_BATCH: (state, batchNo) => {
    state.batchNoTag = batchNo
  }
}

const actions = {
  changeBatchNo({ commit }, batchNo) {
    setBatchNo(batchNo)
    commit('SET_BATCH', batchNo)
  },
  removeBatchNo({ commit }) {
    removeBatchNo()
    commit('SET_BATCH', '')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
