export const state = () => ({
  list: [],
  unread: 0
})

export const mutations = {
  SET_LIST(state, list) { state.list = list },
  SET_UNREAD(state, n) { state.unread = n },
  MARK_READ(state, id) {
    const item = state.list.find(n => n.id === id)
    if (item) {
      item.is_read = true
      state.unread = Math.max(0, state.unread - 1)
    }
  },
  MARK_ALL_READ(state) {
    state.list.forEach(n => { n.is_read = true })
    state.unread = 0
  }
}

export const actions = {
  async fetchNotifications({ commit }) {
    try {
      const res = await this.$axios.get('/learning/notifications/')
      const list = res.data.results || res.data
      commit('SET_LIST', list)
      commit('SET_UNREAD', list.filter(n => !n.is_read).length)
    } catch {}
  },
  async markRead({ commit }, id) {
    try {
      await this.$axios.patch(`/learning/notifications/${id}/read/`)
      commit('MARK_READ', id)
    } catch {}
  },
  async markAllRead({ commit }) {
    try {
      await this.$axios.post('/learning/notifications/read-all/')
      commit('MARK_ALL_READ')
    } catch {}
  }
}

export const getters = {
  unread: s => s.unread
}
