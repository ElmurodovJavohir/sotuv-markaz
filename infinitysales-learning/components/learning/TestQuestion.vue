<template>
  <div class="test-question">
    <p class="test-question__text">{{ question.text }}</p>

    <div class="test-question__options">
      <div
        v-for="(option, index) in question.options"
        :key="index"
        class="test-question__option"
        :class="{
          'is-selected': selectedAnswer === index,
          'is-correct': showResult && option.is_correct,
          'is-wrong': showResult && selectedAnswer === index && !option.is_correct
        }"
        @click="selectAnswer(index)"
      >
        <div class="test-question__option-marker">
          {{ optionLabels[index] }}
        </div>
        <span class="test-question__option-text">{{ option.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    },
    showResult: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedAnswer: null,
      optionLabels: ['A', 'B', 'C', 'D', 'E']
    }
  },
  methods: {
    selectAnswer(index) {
      if (this.showResult) return
      this.selectedAnswer = index
      this.$emit('answer', { questionId: this.question.id, answerIndex: index })
    }
  }
}
</script>

<style lang="scss" scoped>
.test-question {
  &__text {
    font-size: 18px;
    font-weight: 600;
    color: $dark-learning;
    line-height: 1.5;
    margin-bottom: 24px;
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__option {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: $white;
    border: 2px solid $divider;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(.is-selected):not(.is-correct):not(.is-wrong) {
      border-color: $blue-learning;
      background: rgba(38, 138, 231, 0.04);
    }

    &.is-selected {
      border-color: $blue-learning;
      background: rgba(38, 138, 231, 0.06);
    }

    &.is-correct {
      border-color: #00a795;
      background: rgba(0, 167, 149, 0.06);
    }

    &.is-wrong {
      border-color: $red;
      background: rgba(251, 40, 40, 0.06);
    }
  }

  &__option-marker {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: $bg-section;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: $dark-learning;
    flex-shrink: 0;
    transition: all 0.2s;

    .is-selected & {
      background: $blue-learning;
      color: $white;
    }

    .is-correct & {
      background: #00a795;
      color: $white;
    }

    .is-wrong & {
      background: $red;
      color: $white;
    }
  }

  &__option-text {
    font-size: 15px;
    color: $dark-learning;
    line-height: 1.4;
  }
}
</style>
