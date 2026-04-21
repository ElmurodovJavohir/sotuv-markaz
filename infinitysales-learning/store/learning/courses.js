export const state = () => ({
  list: [],
  current: null,
  loading: false
})

export const mutations = {
  SET_LIST(state, list) { state.list = list },
  SET_CURRENT(state, course) { state.current = course },
  SET_LOADING(state, val) { state.loading = val }
}

export const actions = {
  async fetchList({ commit }) {
    commit('SET_LOADING', true)
    try {
      const res = await this.$axios.get('/learning/courses/')
      commit('SET_LIST', res.data.results || res.data)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async fetchCourse({ commit }, slug) {
    commit('SET_LOADING', true)
    try {
      const res = await this.$axios.get(`/learning/courses/${slug}/`)
      commit('SET_CURRENT', res.data)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

export const getters = {
  list: s => s.list,
  current: s => s.current
}
