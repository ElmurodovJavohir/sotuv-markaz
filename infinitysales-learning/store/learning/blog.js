export const state = () => ({
  list: [],
  current: null,
  loading: false,
  page: 1,
  count: 0
})

export const mutations = {
  SET_LIST(state, list) { state.list = list },
  SET_CURRENT(state, post) { state.current = post },
  SET_LOADING(state, val) { state.loading = val },
  SET_PAGE(state, p) { state.page = p },
  SET_COUNT(state, n) { state.count = n }
}

export const actions = {
  async fetchList({ commit, state }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const res = await this.$axios.get('/learning/blog/', { params: { page: state.page, ...params } })
      commit('SET_LIST', res.data.results || res.data)
      commit('SET_COUNT', res.data.count || 0)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async fetchPost({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      const res = await this.$axios.get(`/learning/blog/${id}/`)
      commit('SET_CURRENT', res.data)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

export const getters = {
  list: s => s.list,
  current: s => s.current,
  totalPages: s => Math.ceil(s.count / 12)
}
