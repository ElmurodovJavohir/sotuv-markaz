<template>
  <div class="test-page" :class="{ 'is-started': started }">
    <!-- Intro screen (before start) -->
    <div v-if="!started" class="test-intro">
      <div class="test-intro__card">
        <h1 class="test-intro__title">{{ test ? test.title : $t('test.loading') }}</h1>
        <p class="test-intro__desc">{{ test ? test.description : '' }}</p>

        <div class="test-intro__meta">
          <div class="test-intro__meta-item">
            <img src="/img/icons/list-check.svg" alt="" />
            <div class="test-intro__meta-info">
              <span>{{ $t('test.questionsCount') }}</span>
              <strong>{{ test ? test.questions_count : '—' }} {{ $t('test.pcs') }}</strong>
            </div>
          </div>
          <div class="test-intro__meta-item">
            <img src="/img/icons/clock.svg" alt="" />
            <div class="test-intro__meta-info">
              <span>{{ $t('test.timeLimit') }}</span>
              <strong>{{ test ? test.duration_minutes : '—' }} {{ $t('test.minutes') }}</strong>
            </div>
          </div>
        </div>

        <div class="test-intro__actions">
          <button class="i-btn i-btn_outline" @click="$router.back()">
            {{ $t('test.exit') }}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="i-btn i-btn_blue" @click="startTest">
            {{ $t('test.start') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Test in progress -->
    <div v-else class="test-engine">
      <!-- Header with timer -->
      <div class="test-engine__header">
        <div class="test-engine__progress-label">
          {{ $t('test.question') }} {{ currentIndex + 1 }} / {{ questions.length }}
        </div>
        <TestTimer :seconds="remainingSeconds" />
        <button class="i-btn i-btn_outline test-engine__exit" @click="confirmExit">
          {{ $t('test.exit') }}
        </button>
      </div>

      <div class="test-engine__body">
        <!-- Question -->
        <div class="test-engine__question-area">
          <TestQuestion
            v-if="currentQuestion"
            :key="currentIndex"
            :question="currentQuestion"
            @answer="onAnswer"
          />

          <div class="test-engine__nav">
            <button
              class="i-btn i-btn_outline"
              :disabled="currentIndex === 0"
              @click="prevQuestion"
            >
              {{ $t('test.prev') }}
            </button>
            <button
              v-if="currentIndex < questions.length - 1"
              class="i-btn i-btn_blue"
              @click="nextQuestion"
            >
              {{ $t('test.next') }}
            </button>
            <button
              v-else
              class="i-btn i-btn_blue"
              @click="submitTest"
              :disabled="submitting"
            >
              {{ $t('test.submit') }}
            </button>
          </div>
        </div>

        <!-- Progress grid sidebar -->
        <div class="test-engine__sidebar">
          <TestProgressGrid
            :questions="questions"
            :answers="answers"
            :current="currentIndex"
            @goto="goToQuestion"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TestTimer from '~/components/learning/TestTimer.vue'
import TestQuestion from '~/components/learning/TestQuestion.vue'
import TestProgressGrid from '~/components/learning/TestProgressGrid.vue'

export default {
  layout: 'empty',
  middleware: 'auth_required',
  components: { TestTimer, TestQuestion, TestProgressGrid },

  data() {
    return {
      test: null,
      questions: [],
      answers: {},
      currentIndex: 0,
      started: false,
      remainingSeconds: 0,
      timer: null,
      submitting: false,
      loading: true
    }
  },

  computed: {
    currentQuestion() {
      return this.questions[this.currentIndex] || null
    }
  },

  async fetch() {
    const id = this.$route.params.id
    try {
      const res = await this.$axios.get(`/learning/tests/${id}/`)
      this.test = res.data
      this.remainingSeconds = (res.data.duration_minutes || 30) * 60
    } catch (e) {
      this.test = null
    } finally {
      this.loading = false
    }
  },

  beforeDestroy() {
    this.clearTimer()
  },

  methods: {
    async startTest() {
      const id = this.$route.params.id
      try {
        const res = await this.$axios.post(`/learning/tests/${id}/start/`)
        this.questions = res.data.questions || []
        this.started = true
        this.startTimer()
      } catch (e) {
        this.$toast.error(this.$t('test.startError'))
      }
    },

    startTimer() {
      this.timer = setInterval(() => {
        if (this.remainingSeconds > 0) {
          this.remainingSeconds--
        } else {
          this.submitTest()
        }
      }, 1000)
    },

    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },

    onAnswer({ questionId, answerIndex }) {
      this.$set(this.answers, this.currentIndex, answerIndex)
    },

    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++
      }
    },

    prevQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    },

    goToQuestion(index) {
      this.currentIndex = index
    },

    confirmExit() {
      if (confirm(this.$t('test.exitConfirm'))) {
        this.clearTimer()
        this.$router.back()
      }
    },

    async submitTest() {
      if (this.submitting) return
      this.submitting = true
      this.clearTimer()

      const id = this.$route.params.id
      const payload = {
        answers: Object.entries(this.answers).map(([qIdx, aIdx]) => ({
          question_id: this.questions[qIdx].id,
          answer_index: aIdx
        }))
      }

      try {
        const res = await this.$axios.post(`/learning/tests/${id}/submit/`, payload)
        this.$router.push(this.localePath(`/test/result?test_id=${id}&result_id=${res.data.id}`))
      } catch (e) {
        this.$toast.error(this.$t('test.submitError'))
        this.submitting = false
      }
    }
  },

  head() {
    return { title: (this.test ? this.test.title : this.$t('test.title')) + ' — Infinity Sales Learning' }
  }
}
</script>

<style lang="scss" scoped>
.test-page {
  min-height: 100vh;
  background: $bg-section;
}

// Intro screen
.test-intro {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;

  &__card {
    background: $white;
    border-radius: 16px;
    padding: 32px 100px;
    max-width: 1080px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 42px;
    box-shadow: 0px 4px 20px rgba(0,0,0,0.04);
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: $dark-learning;
    text-align: center;
    line-height: 1.3;
  }

  &__desc {
    font-size: 16px;
    color: $grey-learning;
    text-align: center;
    line-height: 1.4;
    max-width: 880px;
  }

  &__meta {
    display: flex;
    gap: 24px;
    align-items: center;
    justify-content: center;
  }

  &__meta-item {
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(0, 107, 203, 0.04);
    border: 1px solid rgba(0, 107, 203, 0.2);
    border-radius: 12px;
    padding: 12px 20px;
    width: 208px;

    img {
      width: 32px;
      height: 32px;
    }
  }

  &__meta-info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    span {
      font-size: 12px;
      color: $grey-learning;
      line-height: 1.3;
    }

    strong {
      font-size: 14px;
      font-weight: 700;
      color: $dark-learning;
      line-height: 1.3;
    }
  }

  &__actions {
    display: flex;
    gap: 28px;
    align-items: center;

    .i-btn {
      width: 240px;
      height: 44px;
    }
  }
}

// Test engine
.test-engine {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 80px;
    background: $white;
    border-bottom: 1px solid $divider;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  &__progress-label {
    font-size: 14px;
    font-weight: 600;
    color: $dark-learning;
  }

  &__exit {
    height: 40px;
  }

  &__body {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 32px;
    padding: 32px 80px;
    max-width: 1280px;
    margin: 0 auto;
    width: 100%;
  }

  &__question-area {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  &__nav {
    display: flex;
    gap: 16px;
    justify-content: flex-end;

    .i-btn {
      height: 44px;
      min-width: 140px;
    }
  }

  &__sidebar {}
}
</style>
