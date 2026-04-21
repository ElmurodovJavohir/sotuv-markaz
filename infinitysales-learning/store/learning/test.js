export const state = () => ({
  meta: null,
  questions: [],
  answers: {},
  currentIndex: 0,
  remainingSeconds: 0,
  started: false,
  submitting: false,
  result: null
})

export const mutations = {
  SET_META(state, meta) { state.meta = meta },
  SET_QUESTIONS(state, qs) { state.questions = qs },
  SET_ANSWER(state, { index, answerIndex }) {
    state.answers = { ...state.answers, [index]: answerIndex }
  },
  SET_INDEX(state, i) { state.currentIndex = i },
  SET_TIME(state, s) { state.remainingSeconds = s },
  SET_STARTED(state, val) { state.started = val },
  SET_SUBMITTING(state, val) { state.submitting = val },
  SET_RESULT(state, r) { state.result = r },
  RESET(state) {
    state.questions = []
    state.answers = {}
    state.currentIndex = 0
    state.started = false
    state.submitting = false
    state.result = null
  }
}

export const actions = {
  async fetchTest({ commit }, id) {
    const res = await this.$axios.get(`/learning/tests/${id}/`)
    commit('SET_META', res.data)
    commit('SET_TIME', (res.data.duration_minutes || 30) * 60)
    return res.data
  },
  async startTest({ commit }, id) {
    const res = await this.$axios.post(`/learning/tests/${id}/start/`)
    commit('SET_QUESTIONS', res.data.questions || [])
    commit('SET_STARTED', true)
    return res.data
  },
  async submitTest({ commit, state }, id) {
    commit('SET_SUBMITTING', true)
    const payload = {
      answers: Object.entries(state.answers).map(([qIdx, aIdx]) => ({
        question_id: state.questions[qIdx].id,
        answer_index: aIdx
      }))
    }
    try {
      const res = await this.$axios.post(`/learning/tests/${id}/submit/`, payload)
      commit('SET_RESULT', res.data)
      return res.data
    } finally {
      commit('SET_SUBMITTING', false)
    }
  }
}

export const getters = {
  currentQuestion: s => s.questions[s.currentIndex] || null,
  isAnswered: s => i => s.answers[i] !== undefined,
  progress: s => Math.round((Object.keys(s.answers).length / (s.questions.length || 1)) * 100)
}
