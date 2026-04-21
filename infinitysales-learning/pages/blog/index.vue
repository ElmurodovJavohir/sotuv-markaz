<template>
  <div class="blog-page">
    <div class="blog-page__header-offset">
      <div class="l-breadcrumb">
        <span class="l-breadcrumb__item">{{ $t('sidebar.blog') }}</span>
      </div>
    </div>

    <div class="blog-page__layout">
      <div class="blog-page__sidebar">
        <LearningKeySidebar />
      </div>

      <div class="blog-page__content">
        <div class="blog-page__top">
          <h1 class="blog-page__title">{{ $t('blog.title') }}</h1>
          <nuxt-link to="/blog/create" class="i-btn i-btn_blue blog-page__create">
            + {{ $t('blog.create') }}
          </nuxt-link>
        </div>

        <!-- Filters -->
        <div class="blog-page__filters">
          <button
            v-for="tag in tags"
            :key="tag"
            class="blog-page__filter"
            :class="{ 'is-active': activeTag === tag }"
            @click="activeTag = tag; loadPosts()"
          >
            {{ tag }}
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="blog-page__loading">
          <div v-for="i in 6" :key="i" class="blog-page__skeleton"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="!posts.length" class="blog-page__empty">
          {{ $t('blog.empty') }}
        </div>

        <!-- Grid -->
        <div v-else class="blog-page__grid">
          <BlogCard v-for="post in posts" :key="post.id" :post="post" />
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="blog-page__pagination">
          <button
            class="i-btn i-btn_outline"
            :disabled="page === 1"
            @click="page--; loadPosts()"
          >
            ← {{ $t('common.prev') }}
          </button>
          <span class="blog-page__page-info">{{ page }} / {{ totalPages }}</span>
          <button
            class="i-btn i-btn_outline"
            :disabled="page === totalPages"
            @click="page++; loadPosts()"
          >
            {{ $t('common.next') }} →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LearningKeySidebar from '~/components/learning/Sidebar.vue'
import BlogCard from '~/components/learning/BlogCard.vue'

export default {
  layout: 'default',
  middleware: 'auth_required',
  components: { LearningKeySidebar, BlogCard },

  data() {
    return {
      posts: [],
      tags: [],
      activeTag: null,
      page: 1,
      totalPages: 1,
      loading: true
    }
  },

  async fetch() {
    await this.loadPosts()
    try {
      const tagsRes = await this.$axios.get('/learning/blog/tags/')
      this.tags = tagsRes.data
    } catch {}
  },

  methods: {
    async loadPosts() {
      this.loading = true
      try {
        const params = { page: this.page }
        if (this.activeTag) params.tag = this.activeTag
        const res = await this.$axios.get('/learning/blog/', { params })
        this.posts = res.data.results || res.data
        this.totalPages = Math.ceil((res.data.count || this.posts.length) / 12)
      } catch {
        this.posts = []
      } finally {
        this.loading = false
      }
    }
  },

  head() {
    return { title: this.$t('blog.title') + ' — Infinity Sales Learning' }
  }
}
</script>

<style lang="scss" scoped>
.blog-page {
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

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: $dark-learning;
  }

  &__create {
    height: 44px;
    font-size: 14px;
  }

  &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
  }

  &__filter {
    padding: 6px 16px;
    border-radius: 20px;
    background: $bg-section;
    border: 1px solid $divider;
    font-size: 13px;
    color: $grey;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: $blue-learning;
      color: $blue-learning;
    }

    &.is-active {
      background: $blue-learning;
      color: $white;
      border-color: $blue-learning;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  &__empty {
    text-align: center;
    padding: 80px;
    color: $grey;
    font-size: 15px;
  }

  &__skeleton {
    height: 320px;
    border-radius: 16px;
    background: linear-gradient(90deg, $divider 25%, lighten($divider, 5%) 50%, $divider 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s infinite;
  }

  &__loading {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  &__pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 32px;

    .i-btn {
      height: 40px;
    }
  }

  &__page-info {
    font-size: 14px;
    color: $grey;
    min-width: 60px;
    text-align: center;
  }
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
