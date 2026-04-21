<template>
  <footer class="l-footer">
    <div class="l-footer__inner">
      <div class="l-footer__columns">
        <div class="l-footer__col">
          <p class="l-footer__col-title">Infinity sales</p>
          <ul class="l-footer__col-links">
            <li>{{ $t('footer.about') }}</li>
            <li>{{ $t('footer.feedback') }}</li>
            <li>{{ $t('footer.vacancies') }}</li>
            <li>{{ $t('footer.download') }}</li>
            <li>F.A.Q.</li>
          </ul>
        </div>
        <div class="l-footer__col">
          <p class="l-footer__col-title">{{ $t('footer.jobseekers') }}</p>
          <ul class="l-footer__col-links">
            <li>{{ $t('footer.createResume') }}</li>
            <li>{{ $t('footer.feedback') }}</li>
            <li>{{ $t('footer.vacancies') }}</li>
            <li>{{ $t('footer.download') }}</li>
          </ul>
        </div>
        <div class="l-footer__col">
          <p class="l-footer__col-title">{{ $t('footer.employers') }}</p>
          <ul class="l-footer__col-links">
            <li>{{ $t('footer.postVacancy') }}</li>
          </ul>
        </div>
        <div class="l-footer__col">
          <p class="l-footer__col-title">{{ $t('footer.useful') }}</p>
          <ul class="l-footer__col-links">
            <li>{{ $t('footer.brand') }}</li>
            <li>{{ $t('footer.partners') }}</li>
            <li>{{ $t('footer.investors') }}</li>
            <li>{{ $t('footer.ads') }}</li>
            <li>{{ $t('footer.calendar') }}</li>
          </ul>
        </div>
      </div>

      <div class="l-footer__divider"></div>

      <div class="l-footer__bottom">
        <nuxt-link to="/courses" class="l-footer__logo">
          <span class="l-footer__logo-bold">INFINITY</span>
          <span class="l-footer__logo-sub">SALES</span>
        </nuxt-link>

        <div class="l-footer__socials">
          <a href="#" class="l-footer__social" aria-label="LinkedIn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M3.5 2A1.5 1.5 0 102 3.5 1.5 1.5 0 003.5 2zM2 6h3v8H2zm5 0h2.8v1.1h.04A3.08 3.08 0 0113 6c2.82 0 3 1.87 3 4.3V14h-3v-3c0-1.12 0-2.56-1.56-2.56S10 9.76 10 10.93V14H7z"/>
            </svg>
          </a>
          <a href="#" class="l-footer__social" aria-label="Facebook">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M14 8A6 6 0 112 8a6 6 0 0112 0zm-5.5 3.5V9h1.5l.25-1.5H8.5V6.5c0-.4.2-.75.8-.75H10V4.5s-.7-.1-1.4-.1c-1.43 0-2.35.87-2.35 2.44V7.5H4.75V9H6.25v2.5H8.5z"/>
            </svg>
          </a>
          <a href="#" class="l-footer__social" aria-label="Instagram">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M8 2c1.648 0 1.847.006 2.486.036 1.518.069 2.41.962 2.479 2.479.03.638.036.837.036 2.485s-.006 1.847-.036 2.486c-.07 1.515-.96 2.41-2.479 2.479-.639.03-.837.036-2.486.036s-1.847-.006-2.485-.036c-1.519-.069-2.41-.963-2.479-2.479C3.006 9.847 3 9.648 3 8s.006-1.847.036-2.485C3.105 4 3.998 3.105 5.515 3.036 6.153 3.006 6.353 3 8 3zm0-1.5c-1.676 0-1.887.007-2.547.038C3.09 1.617 1.617 3.089 1.538 5.453 1.507 6.113 1.5 6.324 1.5 8s.007 1.887.038 2.547c.079 2.362 1.551 3.836 3.915 3.915.66.031.87.038 2.547.038s1.887-.007 2.547-.038c2.362-.079 3.836-1.552 3.915-3.915.031-.66.038-.87.038-2.547s-.007-1.887-.038-2.547C14.383 3.09 12.91 1.617 10.547 1.538 9.887 1.507 9.676 1.5 8 1.5zm0 2.5a4 4 0 100 8 4 4 0 000-8zm0 6.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm3.9-6.7a.9.9 0 100 1.8.9.9 0 000-1.8z"/>
            </svg>
          </a>
          <a href="#" class="l-footer__social" aria-label="YouTube">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M14.5 4.5s-.2-1.2-.7-1.7c-.7-.7-1.4-.7-1.8-.8C10.5 2 8 2 8 2s-2.5 0-4 .1c-.4 0-1.1.1-1.8.8-.5.5-.7 1.7-.7 1.7S1.4 5.9 1.4 7.3v1.3c0 1.4.1 2.8.1 2.8s.2 1.2.7 1.7c.7.7 1.5.7 1.9.7C5.3 14 8 14 8 14s2.5 0 4-.1c.4 0 1.1-.1 1.8-.8.5-.5.7-1.7.7-1.7s.1-1.4.1-2.8V7.3c0-1.4-.1-2.8-.1-2.8zM6.5 10V6l4 2-4 2z"/>
            </svg>
          </a>
          <a href="#" class="l-footer__social" aria-label="Telegram">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM3.8 8.3l1.9-.8 4.7-1.9c.2-.1.4.1.3.3L9.5 10c-.1.2-.3.3-.5.2l-1.3-.7-1.2.9c-.2.1-.4 0-.4-.2V9.1l-2.3-.8z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.l-footer {
  background: $dark-blue;
  color: $white;

  &__inner {
    padding: 32px 124px;
  }

  &__columns {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  &__col-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
    line-height: 1.3;
  }

  &__col-links {
    display: flex;
    flex-direction: column;
    gap: 12px;

    li {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: $white;
      }
    }
  }

  &__divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.12);
    margin: 32px 0 22px;
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__logo {
    display: flex;
    flex-direction: column;
    line-height: 1;
    text-decoration: none;

    &-bold {
      font-family: 'Unbounded', sans-serif;
      font-weight: 700;
      font-size: 16px;
      color: $white;
    }

    &-sub {
      font-family: 'Unbounded', sans-serif;
      font-size: 8px;
      color: rgba(255, 255, 255, 0.5);
    }
  }

  &__socials {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__social {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #303246;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;

    &:hover {
      background: lighten(#303246, 10%);
    }
  }
}
</style>
