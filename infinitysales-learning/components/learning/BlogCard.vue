<template>
  <nuxt-link :to="`/blog/${post.id}`" class="blog-card">
    <div class="blog-card__cover">
      <img v-if="post.cover" :src="post.cover" :alt="post.title" />
    </div>
    <div class="blog-card__body">
      <div class="blog-card__tags" v-if="post.tags && post.tags.length">
        <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="blog-card__tag">{{ tag }}</span>
      </div>
      <p class="blog-card__title">{{ post.title }}</p>
      <p class="blog-card__excerpt">{{ post.excerpt }}</p>
      <div class="blog-card__footer">
        <div class="blog-card__author">
          <div class="blog-card__avatar">
            <img v-if="post.author_avatar" :src="post.author_avatar" :alt="post.author_name" />
            <span v-else>{{ authorInitial }}</span>
          </div>
          <span class="blog-card__author-name">{{ post.author_name }}</span>
        </div>
        <span class="blog-card__date">{{ formattedDate }}</span>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    authorInitial() {
      return this.post.author_name ? this.post.author_name.charAt(0) : 'U'
    },
    formattedDate() {
      if (!this.post.created_at) return ''
      try {
        return new Date(this.post.created_at).toLocaleDateString(
          this.$i18n.locale === 'uz' ? 'uz-UZ' : 'ru-RU',
          { day: 'numeric', month: 'long', year: 'numeric' }
        )
      } catch {
        return this.post.created_at
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.blog-card {
  display: flex;
  flex-direction: column;
  background: $white;
  border: 1px solid $divider;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  transition: box-shadow 0.2s, transform 0.2s;

  &:hover {
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }

  &__cover {
    height: 200px;
    overflow: hidden;
    background: $bg-section;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    &:hover img {
      transform: scale(1.03);
    }
  }

  &__body {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__tag {
    padding: 4px 10px;
    background: rgba(38, 138, 231, 0.08);
    color: $blue-learning;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    color: $dark-learning;
    line-height: 1.4;
  }

  &__excerpt {
    font-size: 14px;
    color: $grey;
    line-height: 1.5;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid $divider;
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: $blue-learning;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $white;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__author-name {
    font-size: 13px;
    font-weight: 600;
    color: $dark-learning;
  }

  &__date {
    font-size: 12px;
    color: $grey;
  }
}
</style>
