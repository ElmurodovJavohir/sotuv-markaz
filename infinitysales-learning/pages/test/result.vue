<template>
  <div class="test-result-page">
    <div class="test-result-page__card">
      <!-- Icon -->
      <div class="test-result-page__icon" :class="{ 'is-pass': result && result.passed }">
        <svg v-if="result && result.passed" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" stroke="#00a795" stroke-width="3"/>
          <path d="M25 40l10 10 20-20" stroke="#00a795" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" stroke="#fb2828" stroke-width="3"/>
          <path d="M28 28l24 24M52 28l-24 24" stroke="#fb2828" stroke-width="3" stroke-linecap="round"/>
        </svg>
      </div>

      <div v-if="result">
        <h1 class="test-result-page__title">
          {{ result.passed ? $t('test.result.passed') : $t('test.result.failed') }}
        </h1>

        <div class="test-result-page__score-wrap">
          <div class="test-result-page__score">
            <span class="test-result-page__score-num">{{ result.score }}</span>
            <span class="test-result-page__score-sep">/</span>
            <span class="test-result-page__score-total">{{ result.total }}</span>
          </div>
          <p class="test-result-page__score-label">{{ $t('test.result.correct') }}</p>
        </div>

        <div class="test-result-page__verdict-wrap">
          <span class="test-result-page__verdict" :class="`verdict-${result.verdict}`">
            {{ result.verdict }}
          </span>
        </div>

        <p class="test-result-page__message">{{ result.message }}</p>
      </div>

      <div v-else class="test-result-page__loading">
        <p>{{ $t('test.result.loading') }}</p>
      </div>

      <div class="test-result-page__actions">
        <button class="i-btn i-btn_outline" @click="$router.push(localePath('/courses'))">
          {{ $t('test.result.toCourses') }}
        </button>
        <button
          v-if="result && result.certificate_id"
          class="i-btn i-btn_blue"
          @click="$router.push(localePath(`/certificates/${result.certificate_id}`))"
        >
          {{ $t('test.result.certificate') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  middleware: 'auth_required',

  data() {
    return {
      result: null,
      loading: true
    }
  },

  async fetch() {
    const resultId = this.$route.query.result_id
    if (!resultId) return
    try {
      const res = await this.$axios.get(`/learning/test-results/${resultId}/`)
      this.result = res.data
    } catch {
      this.result = null
    } finally {
      this.loading = false
    }
  },

  head() {
    return { title: this.$t('test.result.title') + ' — Infinity Sales Learning' }
  }
}
</script>

<style lang="scss" scoped>
.test-result-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-section;
  padding: 40px;

  &__card {
    background: $white;
    border-radius: 20px;
    padding: 48px;
    max-width: 560px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
    box-shadow: 0px 8px 40px rgba(0, 0, 0, 0.06);
    text-align: center;
  }

  &__icon {
    width: 80px;
    height: 80px;
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    color: $dark-learning;
    margin-bottom: 20px;
  }

  &__score-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  &__score {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  &__score-num {
    font-size: 56px;
    font-weight: 700;
    color: $blue-learning;
    line-height: 1;
  }

  &__score-sep {
    font-size: 32px;
    color: $grey;
  }

  &__score-total {
    font-size: 32px;
    font-weight: 500;
    color: $grey;
  }

  &__score-label {
    font-size: 14px;
    color: $grey;
  }

  &__verdict-wrap {
    margin-top: 4px;
  }

  &__verdict {
    padding: 8px 24px;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;

    &.verdict-HA {
      background: rgba(0, 167, 149, 0.12);
      color: #00a795;
    }

    &.verdict-EHTIMOL {
      background: rgba(255, 150, 0, 0.12);
      color: #ff9600;
    }

    &.verdict-YO\'Q {
      background: rgba(251, 40, 40, 0.12);
      color: $red;
    }
  }

  &__message {
    font-size: 15px;
    color: $grey;
    line-height: 1.5;
    max-width: 400px;
  }

  &__actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;

    .i-btn {
      height: 44px;
      min-width: 160px;
    }
  }

  &__loading {
    color: $grey;
    font-size: 15px;
    padding: 40px;
  }
}
</style>
