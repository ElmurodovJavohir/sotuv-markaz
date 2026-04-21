<template>
  <div class="blog-create-page">
    <div class="blog-create-page__header-offset">
      <div class="l-breadcrumb">
        <nuxt-link to="/blog" class="l-breadcrumb__item">{{ $t('sidebar.blog') }}</nuxt-link>
        <span class="l-breadcrumb__dot"></span>
        <span class="l-breadcrumb__item l-breadcrumb__item--active">
          {{ isEdit ? $t('blog.edit') : $t('blog.create') }}
        </span>
      </div>
    </div>

    <div class="blog-create-page__layout">
      <div class="blog-create-page__sidebar">
        <LearningKeySidebar />
      </div>

      <div class="blog-create-page__content">
        <h1 class="blog-create-page__title">
          {{ isEdit ? $t('blog.edit') : $t('blog.create') }}
        </h1>

        <form class="blog-form" @submit.prevent="submit">
          <div class="i-form__group">
            <label class="i-form__label">{{ $t('blog.form.title') }}</label>
            <input
              v-model="form.title"
              class="i-form__inp"
              :placeholder="$t('blog.form.titlePlaceholder')"
              required
            />
          </div>

          <div class="i-form__group">
            <label class="i-form__label">{{ $t('blog.form.cover') }}</label>
            <input
              v-model="form.cover"
              class="i-form__inp"
              :placeholder="$t('blog.form.coverPlaceholder')"
              type="url"
            />
          </div>

          <div class="i-form__group">
            <label class="i-form__label">{{ $t('blog.form.tags') }}</label>
            <input
              v-model="tagsInput"
              class="i-form__inp"
              :placeholder="$t('blog.form.tagsPlaceholder')"
            />
            <span class="blog-form__hint">{{ $t('blog.form.tagsHint') }}</span>
          </div>

          <div class="i-form__group">
            <label class="i-form__label">{{ $t('blog.form.body') }}</label>
            <textarea
              v-model="form.body"
              class="blog-form__textarea"
              :placeholder="$t('blog.form.bodyPlaceholder')"
              rows="16"
              required
            ></textarea>
          </div>

          <div class="blog-form__actions">
            <nuxt-link to="/blog" class="i-btn i-btn_outline">
              {{ $t('common.cancel') }}
            </nuxt-link>
            <button type="submit" class="i-btn i-btn_blue" :disabled="submitting">
              {{ submitting ? $t('common.saving') : $t('common.save') }}
            </button>
          </div>
        </form>
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
      form: { title: '', cover: '', body: '' },
      tagsInput: '',
      submitting: false
    }
  },

  computed: {
    isEdit() {
      return !!this.$route.query.id
    }
  },

  async fetch() {
    if (this.isEdit) {
      try {
        const res = await this.$axios.get(`/learning/blog/${this.$route.query.id}/`)
        this.form = { title: res.data.title, cover: res.data.cover || '', body: res.data.body }
        this.tagsInput = (res.data.tags || []).join(', ')
      } catch {}
    }
  },

  methods: {
    async submit() {
      if (this.submitting) return
      this.submitting = true
      const payload = {
        ...this.form,
        tags: this.tagsInput.split(',').map(t => t.trim()).filter(Boolean)
      }
      try {
        if (this.isEdit) {
          await this.$axios.put(`/learning/blog/${this.$route.query.id}/`, payload)
        } else {
          await this.$axios.post('/learning/blog/', payload)
        }
        this.$router.push(this.localePath('/blog'))
      } catch (e) {
        this.$toast.error(this.$t('common.error'))
      } finally {
        this.submitting = false
      }
    }
  },

  head() {
    return { title: (this.isEdit ? this.$t('blog.edit') : this.$t('blog.create')) + ' — Infinity Sales Learning' }
  }
}
</script>

<style lang="scss" scoped>
.blog-create-page {
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

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: $dark-learning;
    margin-bottom: 24px;
  }
}

.blog-form {
  display: flex;
  flex-direction: column;

  .i-form__group {
    margin-bottom: 20px;
  }

  &__textarea {
    width: 100%;
    padding: 16px;
    background: $bg-section;
    border: 1px solid $divider;
    border-radius: 8px;
    font-size: 14px;
    color: $dark-learning;
    line-height: 1.6;
    resize: vertical;
    font-family: $fontFamily, sans-serif;
    transition: border-color 0.2s;

    &:focus {
      border-color: $blue-learning;
    }

    &::placeholder {
      color: rgba(103, 113, 122, 0.6);
    }
  }

  &__hint {
    font-size: 12px;
    color: $grey;
    margin-top: 4px;
  }

  &__actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    margin-top: 8px;

    .i-btn {
      height: 44px;
      min-width: 140px;
    }
  }
}
</style>
