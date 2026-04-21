<template>
  <div class="lesson-page">
    <div class="lesson-page__header-offset">
      <div class="l-breadcrumb">
        <nuxt-link to="/courses" class="l-breadcrumb__item">{{ $t('sidebar.elearning') }}</nuxt-link>
        <span class="l-breadcrumb__dot"></span>
        <span class="l-breadcrumb__item" @click="$router.back()" style="cursor:pointer">{{ $t('course.modulesTitle') }}</span>
        <span class="l-breadcrumb__dot"></span>
        <span class="l-breadcrumb__item l-breadcrumb__item--active">{{ $t('lesson.videoLessons') }}</span>
      </div>
    </div>

    <div class="lesson-page__body">
      <!-- Video player -->
      <div class="lesson-page__player">
        <div class="lesson-page__video-wrap">
          <video
            v-if="lesson && lesson.video_url"
            ref="video"
            class="lesson-page__video"
            :src="lesson.video_url"
            controls
          ></video>
          <div v-else class="lesson-page__video-placeholder">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" stroke="#edf1f5" stroke-width="2"/>
              <path d="M26 22l20 10-20 10V22z" fill="#768194"/>
            </svg>
          </div>
        </div>

        <!-- Lesson title + description -->
        <div v-if="lesson" class="lesson-page__info">
          <div class="lesson-page__title-row">
            <h1 class="lesson-page__title">{{ lesson.title }}</h1>
            <button class="lesson-page__bookmark" :class="{ 'is-saved': isSaved }" @click="toggleSave">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                  :stroke="isSaved ? '#268ae7' : '#768194'"
                  :fill="isSaved ? '#268ae7' : 'none'"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
          <p class="lesson-page__description">{{ lesson.description }}</p>
        </div>

        <!-- Divider -->
        <div class="lesson-page__divider"></div>

        <!-- Attached files -->
        <LessonFiles v-if="lesson && lesson.files && lesson.files.length" :files="lesson.files" />

        <!-- Images -->
        <div v-if="lesson && lesson.images && lesson.images.length" class="lesson-page__images">
          <p class="lesson-page__images-title">{{ $t('lesson.images') }}</p>
          <div class="lesson-page__images-grid">
            <div
              v-for="(img, i) in lesson.images"
              :key="i"
              class="lesson-page__image"
              @click="openImage(img)"
            >
              <img :src="img.url" :alt="img.name || ''" />
              <div class="lesson-page__image-overlay"></div>
            </div>
          </div>
        </div>

        <!-- Test result banner (if already taken) -->
        <TestResultBanner
          v-if="testResult"
          :result="testResult"
          class="lesson-page__test-result"
        />
      </div>

      <!-- Test CTA sidebar -->
      <div v-if="lesson && lesson.test_id" class="lesson-page__test-card">
        <div class="test-cta-card">
          <div class="test-cta-card__stats">
            <div class="test-cta-card__id-row">
              <span class="test-cta-card__id-label">ID</span>
              <span class="test-cta-card__id-value">{{ lesson.test_id }}</span>
            </div>
            <p class="test-cta-card__id-desc">{{ $t('lesson.testDesc') }}</p>
          </div>
          <button class="i-btn i-btn_blue test-cta-card__btn" @click="startTest">
            {{ $t('lesson.startTest') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LessonFiles from '~/components/learning/LessonFiles.vue'
import TestResultBanner from '~/components/learning/TestResultBanner.vue'

export default {
  layout: 'default',
  middleware: 'auth_required',
  components: { LessonFiles, TestResultBanner },

  data() {
    return {
      lesson: null,
      testResult: null,
      isSaved: false,
      loading: true
    }
  },

  async fetch() {
    const id = this.$route.params.id
    try {
      const res = await this.$axios.get(`/learning/lessons/${id}/`)
      this.lesson = res.data
      this.isSaved = res.data.is_saved || false

      if (res.data.test_result) {
        this.testResult = res.data.test_result
      }
    } catch (e) {
      this.lesson = null
    } finally {
      this.loading = false
    }
  },

  methods: {
    async toggleSave() {
      const id = this.$route.params.id
      try {
        await this.$axios.post(`/learning/lessons/${id}/bookmark/`)
        this.isSaved = !this.isSaved
      } catch {}
    },
    startTest() {
      if (this.lesson && this.lesson.test_id) {
        this.$router.push(this.localePath(`/test/${this.lesson.test_id}`))
      }
    },
    openImage(img) {
      window.open(img.url, '_blank')
    }
  },

  head() {
    return { title: (this.lesson ? this.lesson.title : this.$t('lesson.loading')) + ' — Infinity Sales Learning' }
  }
}
</script>

<style lang="scss" scoped>
.lesson-page {
  padding-top: 82px;

  &__header-offset {
    height: 48px;
    display: flex;
    align-items: center;
    padding: 0 180px;
    background: $white;
    border-bottom: 1px solid $divider;
  }

  &__body {
    display: grid;
    grid-template-columns: 1fr 360px;
    padding: 24px 180px 48px;
    gap: 32px;
    align-items: start;
  }

  &__player {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__video-wrap {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    background: #000;
    aspect-ratio: 16/9;
  }

  &__video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
  }

  &__video-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $bg-section;
    min-height: 400px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: $dark-learning;
    line-height: 1.3;
    flex: 1;
  }

  &__bookmark {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;

    &:hover svg path {
      stroke: $blue-learning;
    }
  }

  &__description {
    font-size: 14px;
    color: $dark-learning;
    line-height: 1.5;
  }

  &__divider {
    height: 1px;
    background: $divider;
  }

  &__images-title {
    font-size: 16px;
    font-weight: 600;
    color: $dark-learning;
    margin-bottom: 12px;
  }

  &__images-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  &__image {
    width: 224px;
    height: 142px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-overlay {
      position: absolute;
      inset: 0;
      background: rgba(8, 10, 21, 0.4);
      transition: opacity 0.2s;
    }

    &:hover &-overlay {
      opacity: 0;
    }
  }

  &__test-result {
    margin-top: 0;
  }

  &__test-card {
    position: sticky;
    top: 130px;
  }
}

.test-cta-card {
  background: linear-gradient(180deg, #006bcb 0%, #003565 100%);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0px 79px 169px 0px rgba(8,10,21,0.07);

  &__stats {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(7px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__id-row {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  &__id-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.3;
  }

  &__id-value {
    font-size: 24px;
    font-weight: 700;
    color: $white;
    line-height: 1.3;
  }

  &__id-desc {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.3;
    width: 163px;
  }

  &__btn {
    width: 100%;
    height: 44px;
    justify-content: center;
  }
}
</style>
