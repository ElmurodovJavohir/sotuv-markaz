import Middleware from './middleware'
import { Auth, authMiddleware, ExpiredAuthSessionError } from '~auth/runtime'

// Active schemes
import { LocalScheme } from '~auth/runtime'

Middleware.auth = authMiddleware

export default function (ctx, inject) {
  // Options
  const options = {
  "resetOnError": false,
  "ignoreExceptions": false,
  "scopeKey": "scope",
  "rewriteRedirects": true,
  "fullPathRedirect": false,
  "watchLoggedIn": true,
  "redirect": {
    "login": "/auth/login",
    "logout": "/",
    "home": "/",
    "callback": "/login"
  },
  "vuex": {
    "namespace": "auth"
  },
  "cookie": {
    "prefix": "auth.",
    "options": {
      "path": "/"
    }
  },
  "localStorage": {
    "prefix": "auth."
  },
  "defaultStrategy": "loginWorker"
}

  // Create a new Auth instance
  const $auth = new Auth(ctx, options)

  // Register strategies
  // loginWorker
  $auth.registerStrategy('loginWorker', new LocalScheme($auth, {
  "token": {
    "property": "access",
    "type": "Bearer",
    "maxAge": 2592000
  },
  "user": {
    "property": false,
    "autoFetch": true
  },
  "endpoints": {
    "login": {
      "url": "/auth/worker/login/",
      "method": "post"
    },
    "logout": false,
    "user": {
      "url": "/auth/worker/profile/",
      "method": "get"
    }
  },
  "name": "loginWorker"
}))

  // loginCompany
  $auth.registerStrategy('loginCompany', new LocalScheme($auth, {
  "token": {
    "property": "access",
    "type": "Bearer",
    "maxAge": 2592000
  },
  "user": {
    "property": false,
    "autoFetch": true
  },
  "endpoints": {
    "login": {
      "url": "/auth/company/login/",
      "method": "post"
    },
    "logout": false,
    "user": {
      "url": "/auth/company/profile/",
      "method": "get"
    }
  },
  "name": "loginCompany"
}))

  // Inject it to nuxt context as $auth
  inject('auth', $auth)
  ctx.$auth = $auth

  // Initialize auth
  return $auth.init().catch(error => {
    if (process.client) {
      // Don't console log expired auth session errors. This error is common, and expected to happen.
      // The error happens whenever the user does an ssr request (reload/initial navigation) with an expired refresh
      // token. We don't want to log this as an error.
      if (error instanceof ExpiredAuthSessionError) {
        return
      }

      console.error('[ERROR] [AUTH]', error)
    }
  })
}
