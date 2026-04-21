<template>
  <div class="test-progress-grid">
    <p class="test-progress-grid__title">{{ $t('test.questions') }}</p>
    <div class="test-progress-grid__grid">
      <button
        v-for="(q, i) in questions"
        :key="i"
        class="test-progress-grid__cell"
        :class="{
          'is-current': current === i,
          'is-answered': answers[i] !== undefined,
          'is-skipped': skipped.includes(i)
        }"
        @click="$emit('goto', i)"
      >
        {{ i + 1 }}
      </button>
    </div>
    <div class="test-progress-grid__legend">
      <div class="test-progress-grid__legend-item">
        <span class="test-progress-grid__dot is-answered"></span>
        <span>{{ $t('test.answered') }}</span>
      </div>
      <div class="test-progress-grid__legend-item">
        <span class="test-progress-grid__dot is-skipped"></span>
        <span>{{ $t('test.skipped') }}</span>
      </div>
      <div class="test-progress-grid__legend-item">
        <span class="test-progress-grid__dot"></span>
        <span>{{ $t('test.notAnswered') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    questions: { type: Array, required: true },
    answers: { type: Object, default: () => ({}) },
    skipped: { type: Array, default: () => [] },
    current: { type: Number, default: 0 }
  }
}
</script>

<style lang="scss" scoped>
.test-progress-grid {
  background: $white;
  border-radius: 16px;
  padding: 20px;

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: $dark-learning;
    margin-bottom: 16px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    margin-bottom: 20px;
  }

  &__cell {
    height: 36px;
    border-radius: 8px;
    background: $bg-section;
    border: 2px solid transparent;
    font-size: 13px;
    font-weight: 600;
    color: $dark-learning;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: $blue-learning;
    }

    &.is-current {
      border-color: $blue-learning;
      background: rgba(38, 138, 231, 0.08);
      color: $blue-learning;
    }

    &.is-answered {
      background: rgba(0, 167, 149, 0.12);
      color: #00a795;
    }

    &.is-skipped {
      background: rgba(255, 150, 0, 0.12);
      color: #ff9600;
    }
  }

  &__legend {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: $grey;
  }

  &__dot {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    background: $bg-section;
    flex-shrink: 0;

    &.is-answered {
      background: rgba(0, 167, 149, 0.12);
    }

    &.is-skipped {
      background: rgba(255, 150, 0, 0.12);
    }
  }
}
</style>
