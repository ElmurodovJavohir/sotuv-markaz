<template>
  <div class="test-result-banner" :class="`is-${result.status}`">
    <div class="test-result-banner__inner">
      <div class="test-result-banner__icon">
        <svg v-if="result.status === 'passed'" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" fill="#00a795" fill-opacity="0.15"/>
          <path d="M10 16l4 4 8-8" stroke="#00a795" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else-if="result.status === 'failed'" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" fill="#fb2828" fill-opacity="0.15"/>
          <path d="M11 11l10 10M21 11l-10 10" stroke="#fb2828" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="test-result-banner__info">
        <p class="test-result-banner__title">
          {{ result.status === 'passed' ? $t('test.passed') : $t('test.failed') }}
        </p>
        <p class="test-result-banner__score">
          {{ $t('test.score') }}: {{ result.score }} / {{ result.total }}
        </p>
      </div>
      <div class="test-result-banner__verdict" :class="`verdict-${result.verdict}`">
        {{ result.verdict }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    result: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.test-result-banner {
  border-radius: 12px;
  padding: 16px 20px;
  border: 1px solid;

  &.is-passed {
    background: rgba(0, 167, 149, 0.06);
    border-color: rgba(0, 167, 149, 0.2);
  }

  &.is-failed {
    background: rgba(251, 40, 40, 0.06);
    border-color: rgba(251, 40, 40, 0.2);
  }

  &__inner {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__info {
    flex: 1;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: $dark-learning;
    margin-bottom: 4px;
  }

  &__score {
    font-size: 14px;
    color: $grey;
  }

  &__verdict {
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.5px;

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
}
</style>
