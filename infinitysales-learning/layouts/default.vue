<template>
  <div class="wrapper">
    <LearningHeader />
    <div class="page">
      <Nuxt />
    </div>
    <LearningFooter />
  </div>
</template>

<script>
import LearningHeader from '~/components/learning/Header.vue'
import LearningFooter from '~/components/learning/Footer.vue'

export default {
  components: { LearningHeader, LearningFooter }
}
</script>

<style lang="scss" scoped>
.wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: $bg-section;
}

.page {
  flex: 1;
}
</style>
