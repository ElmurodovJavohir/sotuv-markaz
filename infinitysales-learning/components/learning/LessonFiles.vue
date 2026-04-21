<template>
  <div class="lesson-files">
    <p class="lesson-files__title">{{ $t('lesson.attachedFiles') }}</p>
    <div class="lesson-files__list">
      <div
        v-for="file in files"
        :key="file.id"
        class="lesson-files__item"
      >
        <div class="lesson-files__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z" stroke="#268ae7" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M13 2v7h7" stroke="#268ae7" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="lesson-files__meta">
          <span class="lesson-files__name">{{ file.name }}</span>
          <span class="lesson-files__size">{{ file.size }}</span>
        </div>
        <a
          :href="file.url"
          download
          class="lesson-files__download"
          @click.stop
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v10m0 0l-4-4m4 4l4-4" stroke="#768194" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 15h14" stroke="#768194" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    files: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.lesson-files {
  &__title {
    font-size: 16px;
    font-weight: 600;
    color: $dark-learning;
    margin-bottom: 12px;
  }

  &__list {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  &__item {
    flex: 1;
    min-width: 240px;
    height: 48px;
    background: $white;
    border: 1px solid $divider;
    border-radius: 12px;
    display: flex;
    align-items: center;
    padding: 0 12px 0 7px;
    gap: 8px;
  }

  &__icon {
    width: 32px;
    height: 32px;
    background: rgba(0, 107, 203, 0.08);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__name {
    font-size: 12px;
    font-weight: 500;
    color: $dark-learning;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }

  &__size {
    font-size: 12px;
    color: #8898aa;
    line-height: 1.3;
  }

  &__download {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;

    &:hover svg path {
      stroke: $blue-learning;
    }
  }
}
</style>
