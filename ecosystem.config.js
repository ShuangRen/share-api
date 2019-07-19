module.exports = {
  apps: [{
    name: 'apidoc',
    script: './dist/app.js',
    instances: '1',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      SERVER_ENV: 'dev'
    },
    env_staging: {
      NODE_ENV: 'production',
      SERVER_ENV: 'staging'
    },
    env_production: {
      NODE_ENV: 'production',
      SERVER_ENV: 'prod'
    }
  }]
}
