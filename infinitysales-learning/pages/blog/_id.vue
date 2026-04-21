<template>
  <div class="blog-single-page">
    <div class="blog-single-page__header-offset">
      <div class="l-breadcrumb">
        <nuxt-link to="/blog" class="l-breadcrumb__item">{{ $t('sidebar.blog') }}</nuxt-link>
        <span class="l-breadcrumb__dot"></span>
        <span class="l-breadcrumb__item l-breadcrumb__item--active">{{ post ? post.title : '...' }}</span>
      </div>
    </div>

    <div class="blog-single-page__layout">
      <div class="blog-single-page__sidebar">
        <LearningKeySidebar />
      </div>

      <div class="blog-single-page__content">
        <div v-if="loading" class="blog-single-page__loading">
          <div class="blog-single-page__skeleton title"></div>
          <div class="blog-single-page__skeleton body"></div>
        </div>

        <article v-else-if="post" class="blog-article">
          <!-- Cover -->
          <div v-if="post.cover" class="blog-article__cover">
            <img :src="post.cover" :alt="post.title" />
          </div>

          <!-- Meta -->
          <div class="blog-article__meta">
            <div class="blog-article__author">
              <div class="blog-article__avatar">
                <img v-if="post.author_avatar" :src="post.author_avatar" />
                <span v-else>{{ authorInitial }}</span>
              </div>
              <div>
                <p class="blog-article__author-name">{{ post.author_name }}</p>
                <p class="blog-article__date">{{ formattedDate }}</p>
              </div>
            </div>
            <div class="blog-article__tags">
              <span v-for="tag in post.tags" :key="tag" class="blog-article__tag">{{ tag }}</span>
            </div>
          </div>

          <!-- Title -->
          <h1 class="blog-article__title">{{ post.title }}</h1>

          <!-- Body -->
          <div class="blog-article__body" v-html="post.body"></div>
        </article>

        <div v-else class="blog-single-page__not-found">{{ $t('blog.notFound') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import LearningKeySidebar from '~/components/learning/Sidebar.vue'

export default {
  layout: 'default',
  middleware: 'auth_required',
  components: { LearningKeySidebar },

  data() {
    return {
      post: null,
      loading: true
    }
  },

  computed: {
    authorInitial() {
      return this.post && this.post.author_name ? this.post.author_name.charAt(0) : 'U'
    },
    formattedDate() {
      if (!this.post || !this.post.created_at) return ''
      try {
        return new Date(this.post.created_at).toLocaleDateString(
          this.$i18n.locale === 'uz' ? 'uz-UZ' : 'ru-RU',
          { day: 'numeric', month: 'long', year: 'numeric' }
        )
      } catch { return this.post.created_at }
    }
  },

  async fetch() {
    const id = this.$route.params.id
    try {
      const res = await this.$axios.get(`/learning/blog/${id}/`)
      this.post = res.data
    } catch {
      this.post = null
    } finally {
      this.loading = false
    }
  },

  head() {
    return { title: (this.post ? this.post.title : this.$t('blog.title')) + ' — Infinity Sales Learning' }
  }
}
</script>

<style lang="scss" scoped>
.blog-single-page {
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
    padding: 32px 0 48px 32px;
    max-width: 760px;
  }

  &__skeleton {
    background: linear-gradient(90deg, $divider 25%, lighten($divider, 5%) 50%, $divider 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s infinite;
    border-radius: 8px;
    margin-bottom: 20px;

    &.title { height: 48px; width: 80%; }
    &.body { height: 400px; }
  }

  &__not-found {
    text-align: center;
    padding: 80px;
    color: $grey;
  }
}

.blog-article {
  &__cover {
    width: 100%;
    height: 360px;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 24px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 12px;
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: $blue-learning;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $white;
    font-size: 16px;
    font-weight: 700;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__author-name {
    font-size: 15px;
    font-weight: 600;
    color: $dark-learning;
  }

  &__date {
    font-size: 13px;
    color: $grey;
  }

  &__tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__tag {
    padding: 4px 12px;
    background: rgba(38, 138, 231, 0.08);
    color: $blue-learning;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }

  &__title {
    font-size: 32px;
    font-weight: 700;
    color: $dark-learning;
    line-height: 1.3;
    margin-bottom: 24px;
  }

  &__body {
    font-size: 16px;
    line-height: 1.7;
    color: $dark-learning;

    ::v-deep {
      h2, h3 { font-weight: 700; margin: 24px 0 12px; }
      h2 { font-size: 22px; }
      h3 { font-size: 18px; }
      p { margin-bottom: 16px; }
      ul, ol { padding-left: 24px; margin-bottom: 16px; }
      li { margin-bottom: 8px; }
      img { max-width: 100%; border-radius: 8px; margin: 16px 0; }
      blockquote {
        border-left: 4px solid $blue-learning;
        padding-left: 20px;
        color: $grey;
        margin: 20px 0;
      }
    }
  }
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
