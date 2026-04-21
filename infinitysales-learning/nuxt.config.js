module.exports = {
  ssr: false,
  target: "static",

  server: { port: 3005 },

  head: {
    title: "Infinity Sales — Learning",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
  },

  css: ["~/assets/scss/style.scss", "element-ui/lib/theme-chalk/index.css"],

  styleResources: {
    scss: ["~/assets/scss/_functions.scss"],
  },

  plugins: [
    { src: "~/plugins/element-ui.js" },
    { src: "~/plugins/axios.js" },
    { src: "~/plugins/i18n.js" },
    { src: "~/plugins/vuelidate.js" },
    { src: "~/plugins/toastification.js", mode: "client" },
    { src: "~/plugins/icons.js" },
  ],

  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
    "nuxt-i18n",
    "@nuxtjs/style-resources",
    "@nuxtjs/tailwindcss",
  ],

  axios: {
    baseURL: process.env.BASE_URL || "https://jobhunt.uz/api/v1/",
  },

  auth: {
    strategies: {
      loginWorker: {
        scheme: "local",
        token: {
          property: "access",
          type: "Bearer",
          maxAge: 60 * 60 * 24 * 30,
        },
        user: { property: false, autoFetch: true },
        endpoints: {
          login: { url: "/auth/worker/login/", method: "post" },
          logout: false,
          user: { url: "/auth/worker/profile/", method: "get" },
        },
      },
      loginCompany: {
        scheme: "local",
        token: {
          property: "access",
          type: "Bearer",
          maxAge: 60 * 60 * 24 * 30,
        },
        user: { property: false, autoFetch: true },
        endpoints: {
          login: { url: "/auth/company/login/", method: "post" },
          logout: false,
          user: { url: "/auth/company/profile/", method: "get" },
        },
      },
    },
    redirect: { login: "/auth/login", logout: "/", home: "/" },
  },

  i18n: {
    locales: [
      { code: "ru", name: "Русский", file: "ru.json" },
      { code: "uz", name: "O'zbek", file: "uz.json" },
    ],
    langDir: "locales/",
    defaultLocale: "ru",
    strategy: "prefix_and_default",
    vueI18n: { fallbackLocale: "ru" },
  },

  build: {
    transpile: ["element-ui"],
    hardSource: false,
    parallel: false,
    cache: false,
    extractCSS: false,
    optimization: {
      minimize: false,
    },
  },
};
