<template>
  <nuxt-link :to="`/courses/${course.slug || course.id}`" class="course-card-enrolled">
    <div class="course-card-enrolled__cover">
      <img v-if="course.cover" :src="course.cover" :alt="course.title" />
      <div class="course-card-enrolled__cover-overlay"></div>
    </div>

    <div class="course-card-enrolled__info">
      <p class="course-card-enrolled__title">{{ course.title }}</p>

      <div class="course-card-enrolled__progress">
        <div class="course-card-enrolled__progress-bar">
          <div
            class="course-card-enrolled__progress-fill"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
        <span class="course-card-enrolled__progress-label">{{ progress }}%</span>
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
  },
  computed: {
    progress() {
      return this.course.progress || 0
    }
  }
}
</script>

<style lang="scss" scoped>
.course-card-enrolled {
  display: flex;
  align-items: stretch;
  background: $white;
  border: 1px solid #eef2f9;
  border-radius: 20px;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.02);
  height: 100px;
  overflow: hidden;
  text-decoration: none;
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }

  &__cover {
    width: 100px;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 50, 100, 0.15);
    }
  }

  &__info {
    flex: 1;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 12px;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: $dark-blue;
    line-height: 1.3;
  }

  &__progress {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__progress-bar {
    flex: 1;
    height: 4px;
    background: $divider;
    border-radius: 2px;
    overflow: hidden;
  }

  &__progress-fill {
    height: 100%;
    background: $blue-learning;
    border-radius: 2px;
    transition: width 0.4s ease;
  }

  &__progress-label {
    font-size: 12px;
    font-weight: 600;
    color: $grey;
    flex-shrink: 0;
  }
}
</style>
