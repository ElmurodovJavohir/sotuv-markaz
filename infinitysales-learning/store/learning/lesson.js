export const state = () => ({
  current: null,
  loading: false
})

export const mutations = {
  SET_CURRENT(state, lesson) { state.current = lesson },
  SET_LOADING(state, val) { state.loading = val },
  SET_SAVED(state, val) {
    if (state.current) state.current.is_saved = val
  }
}

export const actions = {
  async fetchLesson({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      const res = await this.$axios.get(`/learning/lessons/${id}/`)
      commit('SET_CURRENT', res.data)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async toggleBookmark({ commit, state }) {
    const id = state.current && state.current.id
    if (!id) return
    try {
      await this.$axios.post(`/learning/lessons/${id}/bookmark/`)
      commit('SET_SAVED', !state.current.is_saved)
    } catch {}
  }
}

export const getters = {
  current: s => s.current
}
