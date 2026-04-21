<template>
  <aside class="l-sidebar">
    <!-- Online Learning section -->
    <div class="l-sidebar__section" :class="{ 'is-open': coursesOpen }">
      <div class="l-sidebar__section-header" @click="coursesOpen = !coursesOpen">
        <div class="l-sidebar__section-title">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h8" stroke="#268ae7" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>{{ $t('sidebar.elearning') }}</span>
        </div>
        <svg
          class="l-sidebar__chevron"
          :class="{ 'is-up': coursesOpen }"
          width="20" height="20" viewBox="0 0 20 20" fill="none"
        >
          <path d="M5 7.5l5 5 5-5" stroke="#768194" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <div v-show="coursesOpen" class="l-sidebar__sub">
        <nuxt-link
          v-for="item in courseLinks"
          :key="item.to"
          :to="item.to"
          class="l-sidebar__sub-item"
          active-class="is-active"
          exact
        >
          <span class="l-sidebar__sub-dot"></span>
          <span>{{ item.label }}</span>
        </nuxt-link>
      </div>
    </div>

    <!-- Blog -->
    <nuxt-link to="/blog" class="l-sidebar__item" active-class="is-active">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 4h12v12H4V4zm3 3h6m-6 3h6m-6 3h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>{{ $t('sidebar.blog') }}</span>
    </nuxt-link>

    <!-- Profile -->
    <nuxt-link to="/profile" class="l-sidebar__item" active-class="is-active">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 10a4 4 0 100-8 4 4 0 000 8zM3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>{{ $t('sidebar.profile') }}</span>
    </nuxt-link>

    <!-- Survey -->
    <nuxt-link to="/survey" class="l-sidebar__item" active-class="is-active">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 5v4m0 3v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>{{ $t('sidebar.survey') }}</span>
    </nuxt-link>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      coursesOpen: true
    }
  },
  computed: {
    courseLinks() {
      return [
        { to: '/courses', label: this.$t('sidebar.allCourses') },
        { to: '/courses/my', label: this.$t('sidebar.myCourses') },
        { to: '/courses/tasks', label: this.$t('sidebar.tasks') },
        { to: '/courses/saved', label: this.$t('sidebar.saved') },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.l-sidebar {
  background: $white;
  border: 1px solid $divider;
  border-radius: 12px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.02);
  overflow: hidden;

  &__section {
    border-bottom: 1px solid $divider;

    &:last-child {
      border-bottom: none;
    }
  }

  &__section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    cursor: pointer;
    user-select: none;
  }

  &__section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: $dark-learning;
  }

  &__chevron {
    flex-shrink: 0;
    transition: transform 0.2s;

    &.is-up {
      transform: rotate(180deg);
    }
  }

  &__sub {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 0 12px;
  }

  &__sub-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 16px;
    height: 32px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 400;
    color: $grey;
    transition: color 0.2s;

    &:hover {
      color: $dark-learning;
    }

    &.is-active {
      color: $dark-learning;
      font-weight: 700;

      .l-sidebar__sub-dot {
        background: $dark-learning;
      }
    }
  }

  &__sub-dot {
    width: 12px;
    height: 2px;
    background: $grey;
    border-radius: 1px;
    flex-shrink: 0;
    transition: background 0.2s;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    height: 44px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    color: $dark-learning;
    border-bottom: 1px solid $divider;
    transition: background 0.2s;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: $bg-section;
    }

    &.is-active {
      color: $blue-learning;
    }
  }
}
</style>
