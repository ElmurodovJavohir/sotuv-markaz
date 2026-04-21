<template>
  <div class="certificate-a4" ref="cert">
    <div class="certificate-a4__inner">
      <div class="certificate-a4__header">
        <div class="certificate-a4__logo">
          <span class="certificate-a4__logo-bold">INFINITY</span>
          <span class="certificate-a4__logo-sub">SALES</span>
        </div>
        <p class="certificate-a4__subtitle">{{ $t('certificate.platform') }}</p>
      </div>

      <div class="certificate-a4__body">
        <p class="certificate-a4__label">{{ $t('certificate.this') }}</p>
        <h1 class="certificate-a4__name">{{ certificate.user_name }}</h1>
        <p class="certificate-a4__completed">{{ $t('certificate.completed') }}</p>
        <h2 class="certificate-a4__course">{{ certificate.course_title }}</h2>
        <p class="certificate-a4__date">{{ formattedDate }}</p>
      </div>

      <div class="certificate-a4__footer">
        <div class="certificate-a4__sign">
          <div class="certificate-a4__sign-line"></div>
          <p>{{ $t('certificate.director') }}</p>
        </div>
        <div class="certificate-a4__seal">
          <div class="certificate-a4__seal-circle">IS</div>
        </div>
        <div class="certificate-a4__id">
          <p>{{ $t('certificate.id') }}: {{ certificate.id }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    certificate: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedDate() {
      if (!this.certificate.issued_at) return ''
      try {
        return new Date(this.certificate.issued_at).toLocaleDateString(
          this.$i18n.locale === 'uz' ? 'uz-UZ' : 'ru-RU',
          { day: 'numeric', month: 'long', year: 'numeric' }
        )
      } catch {
        return this.certificate.issued_at
      }
    }
  },
  methods: {
    print() {
      window.print()
    }
  }
}
</script>

<style lang="scss" scoped>
.certificate-a4 {
  width: 210mm;
  min-height: 297mm;
  background: $white;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
  margin: 0 auto;

  @media print {
    box-shadow: none;
    margin: 0;
  }

  &__inner {
    padding: 40px 60px;
    display: flex;
    flex-direction: column;
    gap: 48px;
    min-height: 297mm;
    border: 8px solid $blue-learning;
    position: relative;
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  &__logo {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-bold {
      font-family: 'Unbounded', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: $dark-learning;
    }

    &-sub {
      font-family: 'Unbounded', sans-serif;
      font-size: 12px;
      color: $grey;
    }
  }

  &__subtitle {
    font-size: 14px;
    color: $grey;
  }

  &__body {
    flex: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  &__label {
    font-size: 16px;
    color: $grey;
  }

  &__name {
    font-size: 40px;
    font-weight: 700;
    color: $dark-learning;
    font-family: serif;
  }

  &__completed {
    font-size: 16px;
    color: $grey;
  }

  &__course {
    font-size: 24px;
    font-weight: 700;
    color: $blue-learning;
    max-width: 500px;
    line-height: 1.3;
  }

  &__date {
    font-size: 14px;
    color: $grey;
    margin-top: 8px;
  }

  &__footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__sign {
    text-align: center;
    font-size: 13px;
    color: $grey;

    &-line {
      height: 1px;
      background: $dark-learning;
      width: 150px;
      margin-bottom: 8px;
    }
  }

  &__seal {
    &-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 3px solid $blue-learning;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 700;
      color: $blue-learning;
      font-family: 'Unbounded', sans-serif;
    }
  }

  &__id {
    font-size: 12px;
    color: $grey;
  }
}
</style>
