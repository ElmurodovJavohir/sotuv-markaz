<template>
  <div class="notif-panel">
    <div class="notif-panel__header">
      <h2 class="notif-panel__title">{{ $t('notifications.title') }}</h2>
      <button v-if="unread > 0" class="notif-panel__mark-all" @click="$emit('mark-all-read')">
        {{ $t('notifications.markAllRead') }}
      </button>
    </div>

    <div v-if="items.length === 0" class="notif-panel__empty">
      <p>{{ $t('notifications.empty') }}</p>
    </div>

    <div v-else class="notif-panel__list">
      <div
        v-for="item in items"
        :key="item.id"
        class="notif-panel__item"
        :class="{ 'is-unread': !item.is_read }"
        @click="$emit('click', item)"
      >
        <div class="notif-panel__dot" v-if="!item.is_read"></div>
        <div class="notif-panel__content">
          <p class="notif-panel__item-title">{{ item.title }}</p>
          <p class="notif-panel__item-body">{{ item.body }}</p>
          <span class="notif-panel__item-time">{{ formatTime(item.created_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: { type: Array, default: () => [] }
  },
  computed: {
    unread() {
      return this.items.filter(i => !i.is_read).length
    }
  },
  methods: {
    formatTime(ts) {
      if (!ts) return ''
      try {
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      } catch {
        return ts
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.notif-panel {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    color: $dark-learning;
  }

  &__mark-all {
    font-size: 13px;
    color: $blue-learning;
    font-weight: 500;
    background: transparent;
    border: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  &__empty {
    text-align: center;
    padding: 48px;
    color: $grey;
    font-size: 15px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__item {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: $white;
    border-radius: 12px;
    border: 1px solid $divider;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.04);
    }

    &.is-unread {
      border-color: rgba(38, 138, 231, 0.2);
      background: rgba(38, 138, 231, 0.02);
    }
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $blue-learning;
    flex-shrink: 0;
    margin-top: 6px;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__item-title {
    font-size: 14px;
    font-weight: 600;
    color: $dark-learning;
    margin-bottom: 4px;
  }

  &__item-body {
    font-size: 13px;
    color: $grey;
    line-height: 1.4;
    margin-bottom: 8px;
  }

  &__item-time {
    font-size: 12px;
    color: $grey-learning;
  }
}
</style>
