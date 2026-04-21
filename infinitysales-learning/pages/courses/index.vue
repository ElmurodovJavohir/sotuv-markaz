<template>
  <div class="courses-page">
    <!-- Header offset -->
    <div class="courses-page__header-offset">
      <div class="l-breadcrumb">
        <span class="l-breadcrumb__item">{{ $t('sidebar.elearning') }}</span>
        <span class="l-breadcrumb__dot"></span>
        <span class="l-breadcrumb__item l-breadcrumb__item--active">{{ $t('sidebar.allCourses') }}</span>
      </div>
    </div>

    <div class="courses-page__layout">
      <!-- Sidebar -->
      <div class="courses-page__sidebar">
        <LearningKeySidebar />
      </div>

      <!-- Content -->
      <div class="courses-page__content">
        <h1 class="courses-page__title">{{ $t('sidebar.allCourses') }}</h1>

        <!-- Loading -->
        <div v-if="loading" class="courses-page__loading">
          <div v-for="i in 3" :key="i" class="courses-page__skeleton"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="!courses.length" class="courses-page__empty">
          <p>{{ $t('courses.empty') }}</p>
        </div>

        <!-- List -->
        <div v-else class="courses-page__list">
          <CourseCard
            v-for="course in courses"
            :key="course.id"
            :course="course"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LearningKeySidebar from '~/components/learning/Sidebar.vue'
import CourseCard from '~/components/learning/CourseCard.vue'

export default {
  layout: 'default',
  middleware: 'auth_required',
  components: { LearningKeySidebar, CourseCard },

  data() {
    return {
      courses: [],
      loading: true
    }
  },

  async fetch() {
    try {
      const res = await this.$axios.get('/learning/courses/')
      this.courses = res.data.results || res.data
    } catch (e) {
      this.courses = []
    } finally {
      this.loading = false
    }
  },

  head() {
    return { title: this.$t('sidebar.allCourses') + ' — Infinity Sales Learning' }
  }
}
</script>

<style lang="scss" scoped>
.courses-page {
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
    gap: 0;
    min-height: calc(100vh - 82px - 48px - 387px);
  }

  &__sidebar {
    padding: 24px 16px 32px 0;
    position: sticky;
    top: 130px;
    height: fit-content;
  }

  &__content {
    padding: 24px 0 48px 32px;
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: $dark-learning;
    margin-bottom: 24px;
    line-height: 1.3;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 21px;
    max-width: 804px;
  }

  &__loading,
  &__empty {
    max-width: 804px;
  }

  &__skeleton {
    height: 168px;
    border-radius: 20px;
    background: linear-gradient(90deg, $divider 25%, lighten($divider, 5%) 50%, $divider 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s infinite;
    margin-bottom: 21px;
  }

  &__empty {
    text-align: center;
    padding: 80px;
    color: $grey;
    font-size: 16px;
  }
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
