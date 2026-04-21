<template>
  <div class="profile-page">
    <div class="profile-page__header-offset">
      <div class="l-breadcrumb">
        <span class="l-breadcrumb__item">{{ $t('sidebar.profile') }}</span>
      </div>
    </div>

    <div class="profile-page__layout">
      <!-- Sidebar -->
      <div class="profile-page__sidebar">
        <LearningKeySidebar />
      </div>

      <div class="profile-page__content">
        <!-- User summary -->
        <div class="profile-summary" v-if="user">
          <div class="profile-summary__avatar">
            <img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
            <div v-else class="profile-summary__avatar-placeholder">{{ nameInitial }}</div>
          </div>
          <div class="profile-summary__info">
            <h1 class="profile-summary__name">{{ user.first_name }} {{ user.last_name }}</h1>
            <p class="profile-summary__role">{{ $t('profile.role.' + (user.user_type || 'worker')) }}</p>
            <p class="profile-summary__email">{{ user.email }}</p>
          </div>
          <div class="profile-summary__stats">
            <div class="profile-summary__stat">
              <span class="profile-summary__stat-num">{{ stats.courses_completed || 0 }}</span>
              <span class="profile-summary__stat-label">{{ $t('profile.stats.completed') }}</span>
            </div>
            <div class="profile-summary__stat">
              <span class="profile-summary__stat-num">{{ stats.certificates || 0 }}</span>
              <span class="profile-summary__stat-label">{{ $t('profile.stats.certificates') }}</span>
            </div>
            <div class="profile-summary__stat">
              <span class="profile-summary__stat-num">{{ stats.total_posts || 0 }}</span>
              <span class="profile-summary__stat-label">{{ $t('profile.stats.posts') }}</span>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <ProfileTabs :activeTab="activeTab" @change="activeTab = $event" />

        <!-- Tab: Info -->
        <div v-if="activeTab === 'info'" class="profile-tab">
          <div class="profile-info" v-if="user">
            <div class="profile-info__row">
              <span class="profile-info__label">{{ $t('profile.firstName') }}</span>
              <span class="profile-info__value">{{ user.first_name }}</span>
            </div>
            <div class="profile-info__row">
              <span class="profile-info__label">{{ $t('profile.lastName') }}</span>
              <span class="profile-info__value">{{ user.last_name }}</span>
            </div>
            <div class="profile-info__row">
              <span class="profile-info__label">{{ $t('profile.email') }}</span>
              <span class="profile-info__value">{{ user.email }}</span>
            </div>
            <div class="profile-info__row">
              <span class="profile-info__label">{{ $t('profile.phone') }}</span>
              <span class="profile-info__value">{{ user.phone || '—' }}</span>
            </div>
            <div class="profile-info__row">
              <span class="profile-info__label">{{ $t('profile.company') }}</span>
              <span class="profile-info__value">{{ user.company || '—' }}</span>
            </div>
          </div>
        </div>

        <!-- Tab: Results -->
        <div v-else-if="activeTab === 'results'" class="profile-tab">
          <div v-if="results.length === 0" class="profile-empty">{{ $t('profile.noResults') }}</div>
          <div v-else class="profile-results">
            <div v-for="r in results" :key="r.id" class="profile-result-item">
              <div class="profile-result-item__info">
                <p class="profile-result-item__test">{{ r.test_title }}</p>
                <p class="profile-result-item__course">{{ r.course_title }}</p>
              </div>
              <div class="profile-result-item__score">{{ r.score }} / {{ r.total }}</div>
              <span class="profile-result-item__verdict" :class="`verdict-${r.verdict}`">{{ r.verdict }}</span>
              <nuxt-link
                v-if="r.certificate_id"
                :to="localePath(`/certificates/${r.certificate_id}`)"
                class="i-btn i-btn_outline profile-result-item__cert"
              >
                {{ $t('profile.certificate') }}
              </nuxt-link>
            </div>
          </div>
        </div>

        <!-- Tab: Posts -->
        <div v-else-if="activeTab === 'posts'" class="profile-tab">
          <div v-if="posts.length === 0" class="profile-empty">{{ $t('profile.noPosts') }}</div>
          <div v-else class="profile-posts">
            <BlogCard v-for="post in posts" :key="post.id" :post="post" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LearningKeySidebar from '~/components/learning/Sidebar.vue'
import ProfileTabs from '~/components/learning/ProfileTabs.vue'
import BlogCard from '~/components/learning/BlogCard.vue'

export default {
  layout: 'default',
  middleware: 'auth_required',
  components: { LearningKeySidebar, ProfileTabs, BlogCard },

  data() {
    return {
      activeTab: 'info',
      user: null,
      stats: {},
      results: [],
      posts: []
    }
  },

  computed: {
    nameInitial() {
      return this.user && this.user.first_name ? this.user.first_name.charAt(0) : 'U'
    }
  },

  async fetch() {
    try {
      const [profileRes, statsRes, resultsRes, postsRes] = await Promise.all([
        this.$axios.get('/learning/profile/'),
        this.$axios.get('/learning/profile/stats/'),
        this.$axios.get('/learning/test-results/'),
        this.$axios.get('/learning/blog/my/')
      ])
      this.user = profileRes.data
      this.stats = statsRes.data
      this.results = resultsRes.data.results || resultsRes.data
      this.posts = postsRes.data.results || postsRes.data
    } catch {
      this.user = this.$auth.user || null
    }
  },

  head() {
    return { title: this.$t('sidebar.profile') + ' — Infinity Sales Learning' }
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
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
    padding: 24px 0 48px 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}

.profile-summary {
  display: flex;
  align-items: center;
  gap: 24px;
  background: $white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid $divider;

  &__avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-placeholder {
      width: 100%;
      height: 100%;
      background: $blue-learning;
      color: $white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
    }
  }

  &__info {
    flex: 1;
  }

  &__name {
    font-size: 22px;
    font-weight: 700;
    color: $dark-learning;
    margin-bottom: 4px;
  }

  &__role {
    font-size: 14px;
    color: $blue-learning;
    font-weight: 500;
    margin-bottom: 4px;
  }

  &__email {
    font-size: 14px;
    color: $grey;
  }

  &__stats {
    display: flex;
    gap: 32px;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    &-num {
      font-size: 28px;
      font-weight: 700;
      color: $dark-learning;
    }

    &-label {
      font-size: 12px;
      color: $grey;
      text-align: center;
    }
  }
}

.profile-tab {
  margin-top: 8px;
}

.profile-info {
  background: $white;
  border-radius: 16px;
  border: 1px solid $divider;
  overflow: hidden;

  &__row {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid $divider;

    &:last-child {
      border-bottom: none;
    }
  }

  &__label {
    width: 180px;
    font-size: 14px;
    color: $grey;
    flex-shrink: 0;
  }

  &__value {
    font-size: 14px;
    font-weight: 600;
    color: $dark-learning;
  }
}

.profile-empty {
  text-align: center;
  padding: 64px;
  color: $grey;
  font-size: 15px;
  background: $white;
  border-radius: 16px;
  border: 1px solid $divider;
}

.profile-results {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-result-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: $white;
  border-radius: 12px;
  border: 1px solid $divider;
  padding: 16px 20px;

  &__info {
    flex: 1;
  }

  &__test {
    font-size: 15px;
    font-weight: 600;
    color: $dark-learning;
    margin-bottom: 4px;
  }

  &__course {
    font-size: 13px;
    color: $grey;
  }

  &__score {
    font-size: 16px;
    font-weight: 700;
    color: $dark-learning;
    white-space: nowrap;
  }

  &__verdict {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;

    &.verdict-HA { background: rgba(0,167,149,0.12); color: #00a795; }
    &.verdict-EHTIMOL { background: rgba(255,150,0,0.12); color: #ff9600; }
    &.verdict-YO\'Q { background: rgba(251,40,40,0.12); color: $red; }
  }

  &__cert {
    height: 36px;
    font-size: 13px;
    white-space: nowrap;
  }
}

.profile-posts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
</style>
