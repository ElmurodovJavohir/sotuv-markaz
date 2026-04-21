<template>
  <div class="course-detail-page">
    <div class="course-detail-page__header-offset">
      <div class="l-breadcrumb">
        <nuxt-link to="/courses" class="l-breadcrumb__item">{{ $t('sidebar.elearning') }}</nuxt-link>
        <span class="l-breadcrumb__dot"></span>
        <span class="l-breadcrumb__item l-breadcrumb__item--active">{{ $t('course.modules') }}</span>
      </div>
    </div>

    <div class="course-detail-page__layout">
      <!-- Left: module list -->
      <div class="course-detail-page__main">
        <p class="course-detail-page__tagline">— {{ $t('course.tagline') }}</p>
        <h1 class="course-detail-page__title">{{ $t('course.modulesTitle') }}</h1>

        <div v-if="loading" class="course-detail-page__loading">
          <div v-for="i in 6" :key="i" class="course-detail-page__skeleton"></div>
        </div>

        <div v-else class="course-detail-page__modules">
          <ModuleItem
            v-for="module in modules"
            :key="module.id"
            :module="module"
            @click="goToLesson(module)"
          />
        </div>
      </div>

      <!-- Right: course info card -->
      <div class="course-detail-page__sidebar" v-if="course">
        <div class="course-info-card">
          <div class="course-info-card__cover">
            <img v-if="course.cover" :src="course.cover" :alt="course.title" />
          </div>

          <div class="course-info-card__body">
            <p class="course-info-card__description">{{ course.description }}</p>

            <div class="course-info-card__badges">
              <div class="course-info-card__badge full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#268ae7" stroke-width="1.5"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="#268ae7" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <div class="course-info-card__badge-info">
                  <span>{{ course.start_date }}</span>
                  <span v-if="course.end_date">{{ $t('course.to') }} {{ course.end_date }}</span>
                </div>
              </div>

              <div class="course-info-card__badge half">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="8" height="8" rx="1" stroke="#268ae7" stroke-width="1.5"/>
                  <rect x="13" y="3" width="8" height="8" rx="1" stroke="#268ae7" stroke-width="1.5"/>
                  <rect x="3" y="13" width="8" height="8" rx="1" stroke="#268ae7" stroke-width="1.5"/>
                  <rect x="13" y="13" width="8" height="8" rx="1" stroke="#268ae7" stroke-width="1.5"/>
                </svg>
                <span>{{ course.lessons_count || 0 }} {{ $t('course.lessonsCount') }}</span>
              </div>

              <div class="course-info-card__badge half">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" stroke="#268ae7" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
                <span>{{ course.modules_count || 0 }} {{ $t('course.modulesCount') }}</span>
              </div>

              <div class="course-info-card__badge full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11l3 3L22 4" stroke="#268ae7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#268ae7" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>{{ course.exams_count || 0 }} {{ $t('course.examsCount') }}</span>
              </div>
            </div>
          </div>

          <button
            class="i-btn i-btn_blue course-info-card__cta"
            @click="goToFinalTest"
          >
            {{ $t('course.finalTest') }}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16v16H4V4zm4 4h8m-8 4h4" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModuleItem from '~/components/learning/ModuleItem.vue'

export default {
  layout: 'default',
  middleware: 'auth_required',
  components: { ModuleItem },

  data() {
    return {
      course: null,
      modules: [],
      loading: true
    }
  },

  async fetch() {
    const slug = this.$route.params.slug
    try {
      const [courseRes, modulesRes] = await Promise.all([
        this.$axios.get(`/learning/courses/${slug}/`),
        this.$axios.get(`/learning/courses/${slug}/modules/`)
      ])
      this.course = courseRes.data
      this.modules = modulesRes.data.results || modulesRes.data
    } catch (e) {
      this.course = null
      this.modules = []
    } finally {
      this.loading = false
    }
  },

  methods: {
    goToLesson(module) {
      if (module.first_lesson_id) {
        this.$router.push(this.localePath(`/lessons/${module.first_lesson_id}`))
      }
    },
    goToFinalTest() {
      if (this.course && this.course.final_test_id) {
        this.$router.push(this.localePath(`/test/${this.course.final_test_id}`))
      }
    }
  },

  head() {
    return { title: (this.course ? this.course.title : this.$t('course.loading')) + ' — Infinity Sales Learning' }
  }
}
</script>

<style lang="scss" scoped>
.course-detail-page {
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
    grid-template-columns: 1fr 344px;
    padding: 24px 180px 48px;
    gap: 32px;
    align-items: start;
  }

  &__main {}

  &__tagline {
    font-size: 13px;
    font-weight: 500;
    color: $blue-learning;
    margin-bottom: 4px;
    line-height: 1.25;
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: $dark-learning;
    margin-bottom: 24px;
    line-height: 1.3;
  }

  &__modules {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__skeleton {
    height: 74px;
    border-radius: 16px;
    background: linear-gradient(90deg, $divider 25%, lighten($divider, 5%) 50%, $divider 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s infinite;
    margin-bottom: 16px;
  }

  &__sidebar {
    position: sticky;
    top: 130px;
  }
}

.course-info-card {
  background: $white;
  border-radius: 16px;
  box-shadow: 0px 100px 80px 0px rgba(0,0,0,0.03), 0px 30px 24px 0px rgba(0,0,0,0.02);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__cover {
    height: 180px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(0, 107, 203, 0.1);
    background: $bg-section;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__description {
    font-size: 12px;
    font-weight: 400;
    color: $dark-learning;
    line-height: 1.5;
  }

  &__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 107, 203, 0.04);
    border: 1px solid rgba(0, 107, 203, 0.2);
    border-radius: 12px;
    padding: 11px;
    font-size: 12px;
    font-weight: 600;
    color: $dark-learning;

    &.full {
      width: 100%;
    }

    &.half {
      flex: 1;
    }

    &-info {
      display: flex;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      color: $dark-learning;
    }
  }

  &__cta {
    width: 100%;
    height: 44px;
  }
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
