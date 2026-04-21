import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _6d4f4677 = () => interopDefault(import('..\\pages\\blog\\index.vue' /* webpackChunkName: "pages/blog/index" */))
const _f27da53a = () => interopDefault(import('..\\pages\\courses\\index.vue' /* webpackChunkName: "pages/courses/index" */))
const _8d54951a = () => interopDefault(import('..\\pages\\notifications\\index.vue' /* webpackChunkName: "pages/notifications/index" */))
const _3ba756d2 = () => interopDefault(import('..\\pages\\profile\\index.vue' /* webpackChunkName: "pages/profile/index" */))
const _0eefebce = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _644dd327 = () => interopDefault(import('..\\pages\\blog\\create.vue' /* webpackChunkName: "pages/blog/create" */))
const _0808a290 = () => interopDefault(import('..\\pages\\test\\result.vue' /* webpackChunkName: "pages/test/result" */))
const _5a1a7a9f = () => interopDefault(import('..\\pages\\blog\\_id.vue' /* webpackChunkName: "pages/blog/_id" */))
const _ea705276 = () => interopDefault(import('..\\pages\\certificates\\_id.vue' /* webpackChunkName: "pages/certificates/_id" */))
const _f5eae7ca = () => interopDefault(import('..\\pages\\courses\\_slug.vue' /* webpackChunkName: "pages/courses/_slug" */))
const _3bea0d30 = () => interopDefault(import('..\\pages\\lessons\\_id.vue' /* webpackChunkName: "pages/lessons/_id" */))
const _b67a18a2 = () => interopDefault(import('..\\pages\\test\\_id.vue' /* webpackChunkName: "pages/test/_id" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/blog",
    component: _6d4f4677,
    name: "blog___ru___default"
  }, {
    path: "/courses",
    component: _f27da53a,
    name: "courses___ru___default"
  }, {
    path: "/notifications",
    component: _8d54951a,
    name: "notifications___ru___default"
  }, {
    path: "/profile",
    component: _3ba756d2,
    name: "profile___ru___default"
  }, {
    path: "/ru",
    component: _0eefebce,
    name: "index___ru"
  }, {
    path: "/uz",
    component: _0eefebce,
    name: "index___uz"
  }, {
    path: "/blog/create",
    component: _644dd327,
    name: "blog-create___ru___default"
  }, {
    path: "/ru/blog",
    component: _6d4f4677,
    name: "blog___ru"
  }, {
    path: "/ru/courses",
    component: _f27da53a,
    name: "courses___ru"
  }, {
    path: "/ru/notifications",
    component: _8d54951a,
    name: "notifications___ru"
  }, {
    path: "/ru/profile",
    component: _3ba756d2,
    name: "profile___ru"
  }, {
    path: "/test/result",
    component: _0808a290,
    name: "test-result___ru___default"
  }, {
    path: "/uz/blog",
    component: _6d4f4677,
    name: "blog___uz"
  }, {
    path: "/uz/courses",
    component: _f27da53a,
    name: "courses___uz"
  }, {
    path: "/uz/notifications",
    component: _8d54951a,
    name: "notifications___uz"
  }, {
    path: "/uz/profile",
    component: _3ba756d2,
    name: "profile___uz"
  }, {
    path: "/ru/blog/create",
    component: _644dd327,
    name: "blog-create___ru"
  }, {
    path: "/ru/test/result",
    component: _0808a290,
    name: "test-result___ru"
  }, {
    path: "/uz/blog/create",
    component: _644dd327,
    name: "blog-create___uz"
  }, {
    path: "/uz/test/result",
    component: _0808a290,
    name: "test-result___uz"
  }, {
    path: "/",
    component: _0eefebce,
    name: "index___ru___default"
  }, {
    path: "/ru/blog/:id",
    component: _5a1a7a9f,
    name: "blog-id___ru"
  }, {
    path: "/ru/certificates/:id?",
    component: _ea705276,
    name: "certificates-id___ru"
  }, {
    path: "/ru/courses/:slug",
    component: _f5eae7ca,
    name: "courses-slug___ru"
  }, {
    path: "/ru/lessons/:id?",
    component: _3bea0d30,
    name: "lessons-id___ru"
  }, {
    path: "/ru/test/:id?",
    component: _b67a18a2,
    name: "test-id___ru"
  }, {
    path: "/uz/blog/:id",
    component: _5a1a7a9f,
    name: "blog-id___uz"
  }, {
    path: "/uz/certificates/:id?",
    component: _ea705276,
    name: "certificates-id___uz"
  }, {
    path: "/uz/courses/:slug",
    component: _f5eae7ca,
    name: "courses-slug___uz"
  }, {
    path: "/uz/lessons/:id?",
    component: _3bea0d30,
    name: "lessons-id___uz"
  }, {
    path: "/uz/test/:id?",
    component: _b67a18a2,
    name: "test-id___uz"
  }, {
    path: "/blog/:id",
    component: _5a1a7a9f,
    name: "blog-id___ru___default"
  }, {
    path: "/certificates/:id?",
    component: _ea705276,
    name: "certificates-id___ru___default"
  }, {
    path: "/courses/:slug",
    component: _f5eae7ca,
    name: "courses-slug___ru___default"
  }, {
    path: "/lessons/:id?",
    component: _3bea0d30,
    name: "lessons-id___ru___default"
  }, {
    path: "/test/:id?",
    component: _b67a18a2,
    name: "test-id___ru___default"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
