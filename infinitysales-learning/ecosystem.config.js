module.exports = {
  apps: [
    {
      name: 'infinity-sales-learning',
      exec_mode: 'cluster',
      instances: 'max',
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start',
      env: {
        HOST: '0.0.0.0',
        PORT: 3006,
        NODE_ENV: 'production',
        BASE_URL: 'https://jobhunt.uz/api/v1/'
      }
    }
  ]
}
