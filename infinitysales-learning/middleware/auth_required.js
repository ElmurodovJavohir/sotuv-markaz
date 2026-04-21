export default function ({ $auth, app }) {
  if (!$auth.loggedIn) {
    app.router.push({
      path: '/auth/login',
      query: { redirect: app.router.currentRoute.fullPath },
    })
  }
}
