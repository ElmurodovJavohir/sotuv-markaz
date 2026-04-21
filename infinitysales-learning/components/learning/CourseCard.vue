<template>
  <nuxt-link :to="`/courses/${course.slug || course.id}`" class="course-card">
    <!-- Cover -->
    <div class="course-card__cover">
      <img
        v-if="course.cover"
        :src="course.cover"
        :alt="course.title"
        class="course-card__cover-img"
      />
      <div class="course-card__cover-overlay"></div>
    </div>

    <!-- Info -->
    <div class="course-card__info">
      <div class="course-card__title-wrap">
        <p class="course-card__title">{{ course.title }}</p>
      </div>

      <div class="course-card__meta">
        <div class="course-card__badge">
          <img src="/img/icons/clock.svg" alt="" />
          <span class="course-card__badge-label">{{ $t('course.duration') }}</span>
          <span class="course-card__badge-value">{{ course.duration || '—' }}</span>
        </div>
        <div class="course-card__badge">
          <img src="/img/icons/modules.svg" alt="" />
          <span class="course-card__badge-label">{{ $t('course.modules') }}</span>
          <span class="course-card__badge-value">{{ course.modules_count || 0 }} {{ $t('course.pcs') }}</span>
        </div>
        <div class="course-card__badge">
          <img src="/img/icons/video.svg" alt="" />
          <span class="course-card__badge-label">{{ $t('course.lessons') }}</span>
          <span class="course-card__badge-value">{{ course.lessons_count || 0 }} {{ $t('course.pcs') }}</span>
        </div>
        <div class="course-card__badge">
          <img src="/img/icons/exam.svg" alt="" />
          <span class="course-card__badge-label">{{ $t('course.exams') }}</span>
          <span class="course-card__badge-value">{{ course.exams_count || 0 }} {{ $t('course.pcs') }}</span>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.course-card {
  display: flex;
  align-items: stretch;
  background: $white;
  border: 1px solid #eef2f9;
  border-radius: 20px;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.02);
  height: 168px;
  overflow: hidden;
  text-decoration: none;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;

  &:hover {
    box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }

  &__cover {
    width: 212px;
    flex-shrink: 0;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    margin: 19px 0 19px 19px;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  &__cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    inset: 0;
  }

  &__cover-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 50, 100, 0.15);
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 19px 19px 19px 20px;
    min-width: 0;
  }

  &__title-wrap {
    flex: 1;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    color: $dark-blue;
    line-height: 1.3;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__badge {
    flex: 1;
    min-width: 0;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid #eef2f9;
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    img {
      width: 20px;
      height: 20px;
    }

    &-label {
      font-size: 12px;
      font-weight: 400;
      color: $grey;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    &-value {
      font-size: 12px;
      font-weight: 600;
      color: $dark-blue;
      white-space: nowrap;
    }
  }
}
</style>
