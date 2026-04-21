<template>
  <div class="certificate-page">
    <div class="certificate-page__toolbar">
      <button class="i-btn i-btn_outline" @click="$router.back()">
        ← {{ $t('common.back') }}
      </button>
      <h1 class="certificate-page__title">{{ $t('certificate.title') }}</h1>
      <button class="i-btn i-btn_blue" @click="printCert">
        {{ $t('certificate.print') }}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 8V2h10v6M5 15H3a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2h-2m-8 0v3h6v-3H5z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <div class="certificate-page__body">
      <div v-if="loading" class="certificate-page__loading">
        <p>{{ $t('common.loading') }}</p>
      </div>
      <CertificateA4 v-else-if="certificate" ref="cert" :certificate="certificate" />
      <div v-else class="certificate-page__error">
        {{ $t('certificate.notFound') }}
      </div>
    </div>
  </div>
</template>

<script>
import CertificateA4 from '~/components/learning/CertificateA4.vue'

export default {
  layout: 'empty',
  middleware: 'auth_required',
  components: { CertificateA4 },

  data() {
    return {
      certificate: null,
      loading: true
    }
  },

  async fetch() {
    const id = this.$route.params.id
    try {
      const res = await this.$axios.get(`/learning/certificates/${id}/`)
      this.certificate = res.data
    } catch {
      this.certificate = null
    } finally {
      this.loading = false
    }
  },

  methods: {
    printCert() {
      window.print()
    }
  },

  head() {
    return { title: this.$t('certificate.title') + ' — Infinity Sales Learning' }
  }
}
</script>

<style lang="scss" scoped>
.certificate-page {
  min-height: 100vh;
  background: $bg-section;

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 40px;
    background: $white;
    border-bottom: 1px solid $divider;
    position: sticky;
    top: 0;
    z-index: 10;

    @media print {
      display: none;
    }
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    color: $dark-learning;
  }

  &__body {
    padding: 40px;
    display: flex;
    justify-content: center;

    @media print {
      padding: 0;
    }
  }

  &__loading,
  &__error {
    text-align: center;
    padding: 80px;
    color: $grey;
    font-size: 16px;
  }
}
</style>
