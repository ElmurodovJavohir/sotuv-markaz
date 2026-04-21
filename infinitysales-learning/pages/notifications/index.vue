<template>
  <div class="notifications-page">
    <div class="notifications-page__header-offset">
      <div class="l-breadcrumb">
        <span class="l-breadcrumb__item">{{ $t('notifications.title') }}</span>
      </div>
    </div>

    <div class="notifications-page__layout">
      <div class="notifications-page__sidebar">
        <LearningKeySidebar />
      </div>

      <div class="notifications-page__content">
        <div v-if="selected" class="notifications-page__detail">
          <button class="i-btn i-btn_outline notifications-page__back" @click="selected = null">
            ← {{ $t('common.back') }}
          </button>
          <div class="notification-detail">
            <h2 class="notification-detail__title">{{ selected.title }}</h2>
            <p class="notification-detail__time">{{ formatTime(selected.created_at) }}</p>
            <p class="notification-detail__body">{{ selected.body }}</p>
          </div>
        </div>

        <NotificationPanel
          v-else
          :items="notifications"
          @click="openNotification"
          @mark-all-read="markAllRead"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LearningKeySidebar from '~/components/learning/Sidebar.vue'
import NotificationPanel from '~/components/learning/NotificationPanel.vue'

export default {
  layout: 'default',
  middleware: 'auth_required',
  components: { LearningKeySidebar, NotificationPanel },

  data() {
    return {
      notifications: [],
      selected: null,
      loading: true
    }
  },

  async fetch() {
    try {
      const res = await this.$axios.get('/learning/notifications/')
      this.notifications = res.data.results || res.data
    } catch {
      this.notifications = []
    } finally {
      this.loading = false
    }
  },

  methods: {
    async openNotification(item) {
      this.selected = item
      if (!item.is_read) {
        try {
          await this.$axios.patch(`/learning/notifications/${item.id}/read/`)
          item.is_read = true
        } catch {}
      }
    },
    async markAllRead() {
      try {
        await this.$axios.post('/learning/notifications/read-all/')
        this.notifications.forEach(n => { n.is_read = true })
      } catch {}
    },
    formatTime(ts) {
      if (!ts) return ''
      try {
        return new Date(ts).toLocaleString(this.$i18n.locale === 'uz' ? 'uz-UZ' : 'ru-RU')
      } catch { return ts }
    }
  },

  head() {
    return { title: this.$t('notifications.title') + ' — Infinity Sales Learning' }
  }
}
</script>

<style lang="scss" scoped>
.notifications-page {
  padding-top: 82px;

  &__header-offset {
    height: 48px;
    display: flex;
    align-items: center;
    padding: 0 180px;
    background: $white;
    border-bottom: 1px solid $divider;
  }

  &__layout {
    display: grid;
    grid-template-columns: 264px 1fr;
    padding: 0 76px;
  }

  &__sidebar {
    padding: 24px 16px 32px 0;
    position: sticky;
    top: 130px;
    height: fit-content;
  }

  &__content {
    padding: 32px 0 48px 32px;
    max-width: 760px;
  }

  &__back {
    height: 40px;
    margin-bottom: 24px;
    font-size: 13px;
  }

  &__detail {}
}

.notification-detail {
  background: $white;
  border-radius: 16px;
  border: 1px solid $divider;
  padding: 24px;

  &__title {
    font-size: 20px;
    font-weight: 700;
    color: $dark-learning;
    margin-bottom: 8px;
  }

  &__time {
    font-size: 13px;
    color: $grey;
    margin-bottom: 20px;
  }

  &__body {
    font-size: 15px;
    color: $dark-learning;
    line-height: 1.6;
  }
}
</style>
