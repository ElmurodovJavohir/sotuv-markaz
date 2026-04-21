<template>
  <header class="l-header">
    <div class="l-header__inner">
      <nuxt-link to="/courses" class="l-header__logo">
        <img src="/img/logo.svg" alt="Infinity Sales" class="l-header__logo-img" />
        <div class="l-header__logo-text">
          <span class="l-header__logo-bold">INFINITY</span>
          <span class="l-header__logo-sub">SALES</span>
        </div>
      </nuxt-link>

      <div class="l-header__right">
        <!-- Language switcher -->
        <div class="l-header__lang" @click="toggleLang">
          <span class="l-header__lang-label">{{ currentLocaleLabel }}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="#768194" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <!-- Icons -->
        <div class="l-header__actions">
          <button class="l-header__icon-btn" @click="$router.push('/notifications')">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C6.686 2 4 4.686 4 8v4l-1.5 2.5h15L16 12V8c0-3.314-2.686-6-6-6z" stroke="#768194" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 18c1.1 0 2-.9 2-2H8c0 1.1.9 2 2 2z" stroke="#768194" stroke-width="1.5"/>
            </svg>
          </button>
        </div>

        <!-- User -->
        <div v-if="$auth.loggedIn" class="l-header__user" @click="$router.push('/profile')">
          <div class="l-header__avatar">
            <img
              v-if="$auth.user && $auth.user.avatar"
              :src="$auth.user.avatar"
              :alt="userName"
            />
            <div v-else class="l-header__avatar-placeholder">
              {{ userInitial }}
            </div>
          </div>
          <div class="l-header__user-info">
            <span class="l-header__user-name">{{ userName }}</span>
            <span class="l-header__user-role">{{ userRole }}</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="#768194" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  computed: {
    currentLocaleLabel() {
      return this.$i18n.locale === 'uz' ? "O'z" : 'Ру'
    },
    userName() {
      if (!this.$auth.user) return ''
      return this.$auth.user.first_name || this.$auth.user.name || $t('profile.user')
    },
    userInitial() {
      return this.userName ? this.userName.charAt(0).toUpperCase() : 'U'
    },
    userRole() {
      if (!this.$auth.user) return ''
      const type = this.$auth.user.user_type
      if (type === 'company') return this.$t('header.employer')
      return this.$t('header.jobseeker')
    }
  },
  methods: {
    toggleLang() {
      const next = this.$i18n.locale === 'ru' ? 'uz' : 'ru'
      this.$i18n.setLocale(next)
    }
  }
}
</script>

<style lang="scss" scoped>
.l-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: $white;
  box-shadow: 0px 8px 28px 0px rgba(0, 0, 0, 0.08);
  height: 82px;

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 76px;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;

    &-img {
      height: 24px;
      width: auto;
    }

    &-text {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }

    &-bold {
      font-family: 'Unbounded', sans-serif;
      font-weight: 700;
      font-size: 14px;
      color: $dark-learning;
    }

    &-sub {
      font-family: 'Unbounded', sans-serif;
      font-size: 9px;
      color: rgba(0, 0, 0, 0.5);
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  &__lang {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;

    &-label {
      font-size: 14px;
      color: $dark-learning;
      font-weight: 500;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
  }

  &__avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 1px solid $divider;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $blue-learning;
    color: $white;
    font-weight: 700;
    font-size: 16px;
  }

  &__user-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__user-name {
    font-size: 14px;
    color: $dark-blue;
    line-height: 1.3;
    font-weight: 500;
  }

  &__user-role {
    font-size: 12px;
    color: $grey;
    line-height: 1.3;
  }
}
</style>
