<template>
  <div class="test-timer" :class="{ 'is-warning': isWarning, 'is-danger': isDanger }">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
      <path d="M10 6v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <span class="test-timer__time">{{ formattedTime }}</span>
  </div>
</template>

<script>
export default {
  props: {
    seconds: {
      type: Number,
      required: true
    }
  },
  computed: {
    formattedTime() {
      const m = Math.floor(this.seconds / 60)
      const s = this.seconds % 60
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    },
    isWarning() {
      return this.seconds <= 300 && this.seconds > 60
    },
    isDanger() {
      return this.seconds <= 60
    }
  }
}
</script>

<style lang="scss" scoped>
.test-timer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(38, 138, 231, 0.08);
  border-radius: 8px;
  color: $blue-learning;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s;

  &.is-warning {
    background: rgba(255, 150, 0, 0.1);
    color: #ff9600;
  }

  &.is-danger {
    background: rgba(251, 40, 40, 0.1);
    color: $red;
    animation: pulse 1s infinite;
  }

  &__time {
    font-variant-numeric: tabular-nums;
    min-width: 52px;
    text-align: center;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
