<template>
  <div class="profile-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="profile-tabs__tab"
      :class="{ 'is-active': activeTab === tab.key }"
      @click="$emit('change', tab.key)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    activeTab: {
      type: String,
      required: true
    }
  },
  computed: {
    tabs() {
      return [
        { key: 'info', label: this.$t('profile.info') },
        { key: 'results', label: this.$t('profile.results') },
        { key: 'posts', label: this.$t('profile.posts') },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-tabs {
  display: flex;
  gap: 4px;
  background: $bg-section;
  border-radius: 10px;
  padding: 4px;

  &__tab {
    flex: 1;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: $grey;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;

    &:hover {
      color: $dark-learning;
    }

    &.is-active {
      background: $white;
      color: $dark-learning;
      font-weight: 600;
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
    }
  }
}
</style>
