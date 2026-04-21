export const state = () => ({
  data: null,
  stats: {},
  results: [],
  certificates: [],
  posts: []
})

export const mutations = {
  SET_DATA(state, d) { state.data = d },
  SET_STATS(state, s) { state.stats = s },
  SET_RESULTS(state, r) { state.results = r },
  SET_CERTIFICATES(state, c) { state.certificates = c },
  SET_POSTS(state, p) { state.posts = p }
}

export const actions = {
  async fetchProfile({ commit }) {
    try {
      const [profileRes, statsRes, resultsRes, certsRes, postsRes] = await Promise.all([
        this.$axios.get('/learning/profile/'),
        this.$axios.get('/learning/profile/stats/'),
        this.$axios.get('/learning/test-results/'),
        this.$axios.get('/learning/certificates/'),
        this.$axios.get('/learning/blog/my/')
      ])
      commit('SET_DATA', profileRes.data)
      commit('SET_STATS', statsRes.data)
      commit('SET_RESULTS', resultsRes.data.results || resultsRes.data)
      commit('SET_CERTIFICATES', certsRes.data.results || certsRes.data)
      commit('SET_POSTS', postsRes.data.results || postsRes.data)
    } catch {}
  }
}

export const getters = {
  data: s => s.data,
  stats: s => s.stats,
  results: s => s.results,
  certificates: s => s.certificates,
  posts: s => s.posts
}
