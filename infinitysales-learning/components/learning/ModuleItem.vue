<template>
  <div class="module-item" :class="statusClass" @click="onClick">
    <div class="module-item__body">
      <div class="module-item__main">
        <p class="module-item__title">{{ module.title }}</p>
        <div class="module-item__meta">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="#67717a" stroke-width="1.2"/>
            <path d="M8 5v3l2 2" stroke="#67717a" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          <span>{{ module.duration || '00:00:00' }}</span>
        </div>
      </div>
    </div>

    <!-- Progress circle or lock -->
    <div class="module-item__status">
      <div v-if="module.status === 'completed'" class="module-item__circle module-item__circle--done">
        <svg class="module-item__ring" viewBox="0 0 42 42">
          <circle class="module-item__ring-bg" cx="21" cy="21" r="18" />
          <circle
            class="module-item__ring-progress"
            cx="21" cy="21" r="18"
            :stroke-dasharray="`${(module.progress || 100) * 1.131} 113.1`"
          />
        </svg>
        <span class="module-item__circle-text">{{ module.progress || 100 }}%</span>
      </div>

      <div v-else-if="module.status === 'locked'" class="module-item__circle module-item__circle--locked">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="11" width="14" height="10" rx="2" stroke="#768194" stroke-width="1.5"/>
          <path d="M8 11V7a4 4 0 018 0v4" stroke="#768194" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>

      <div v-else class="module-item__circle module-item__circle--progress">
        <svg class="module-item__ring" viewBox="0 0 42 42">
          <circle class="module-item__ring-bg" cx="21" cy="21" r="18" />
          <circle
            class="module-item__ring-progress"
            cx="21" cy="21" r="18"
            :stroke-dasharray="`${(module.progress || 0) * 1.131} 113.1`"
          />
        </svg>
        <span class="module-item__circle-text">{{ module.progress || 0 }}%</span>
      </div>
    </div>

    <!-- Chevron -->
    <div class="module-item__chevron">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 18l6-6-6-6" stroke="#768194" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    module: {
      type: Object,
      required: true
    }
  },
  computed: {
    statusClass() {
      return {
        'is-locked': this.module.status === 'locked',
        'is-completed': this.module.status === 'completed'
      }
    }
  },
  methods: {
    onClick() {
      if (this.module.status === 'locked') return
      this.$emit('click', this.module)
    }
  }
}
</script>

<style lang="scss" scoped>
.module-item {
  display: flex;
  align-items: center;
  background: $white;
  border-radius: 16px;
  height: 74px;
  padding: 0 20px;
  cursor: pointer;
  transition: box-shadow 0.2s;
  gap: 12px;

  &:hover:not(.is-locked) {
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.06);
  }

  &.is-locked {
    cursor: default;
    opacity: 0.7;
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: $dark-learning;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 550px;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
    color: $grey-learning;
  }

  &__status {
    flex-shrink: 0;
  }

  &__circle {
    width: 42px;
    height: 42px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &--locked {
      background: $bg-section;
      border-radius: 50%;
    }
  }

  &__ring {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  &__ring-bg {
    fill: none;
    stroke: $divider;
    stroke-width: 3;
  }

  &__ring-progress {
    fill: none;
    stroke: $blue-learning;
    stroke-width: 3;
    stroke-linecap: round;
    transition: stroke-dasharray 0.4s ease;
  }

  &__circle--done &__ring-progress {
    stroke: #00a795;
  }

  &__circle-text {
    position: relative;
    font-size: 10px;
    font-weight: 700;
    color: $dark-learning;
  }

  &__chevron {
    flex-shrink: 0;
  }
}
</style>
