export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: true,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  css: [
    "~/node_modules/bootstrap/dist/css/bootstrap.min.css"
  ],
  head: {
    titleTemplate: '%s - goandup-test-for-venturas',
    title: 'goandup-test-for-venturas',
    script: [
      { src: 'https://code.jquery.com/jquery-3.6.0.slim.min.js', crossorigin: 'anonymous' },
      { src: 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js', crossorigin: 'anonymous' },
      { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.7.0/dist/js/bootstrap.min.js', crossorigin: 'anonymous' },
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: true,
    baseURL:'localhost:3001'
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
}
