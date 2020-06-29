import { Configuration } from '@nuxt/types'

import colors from 'vuetify/es5/util/colors'

import axios from 'axios'
require('dotenv').config()

const siteTitle = 'LPF REV UP 2020'
const twitterId: string = '@line_dc_jp'

const scripts = [{ src: 'https://static.line-scdn.net/liff/edge/2.1/sdk.js' }]
if (
  process.env.NODE_ENV === 'development' ||
  process.env.USE_VCONSOLE === 'true'
) {
  scripts.push({
    src: 'https://cdnjs.cloudflare.com/ajax/libs/vConsole/3.3.4/vconsole.min.js'
  })
}

const nuxtConfig: Configuration = {
  mode: 'universal',
  target: 'static',
  srcDir: 'src',
  /*
   ** Headers of the page
   */
  head: {
    title: siteTitle,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: twitterId },
      { name: 'twitter:creator', content: twitterId }
    ],
    script: scripts,
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'shortcut icon', href: '/favicon.ico' }
    ]
  },
  manifest: {
    name: siteTitle,
    lang: 'ja',
    short_name: siteTitle,
    title: siteTitle,
    description:
      '新しいプラットフォームの登場による人々の生活の劇的な変化、そしてそれを実現する開発者が活躍できる世界の到来',
    theme_color: '#ffffff',
    background_color: '#ffffff'
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: '~/plugins/liff.ts', ssr: false }],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify', '@nuxtjs/moment'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    ['@nuxtjs/moment', ['ja']],
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/proxy'
  ],
  proxy: {
    '/.netlify/functions/connpass': {
      target: 'http://localhost:9000'
    },
  },
  moment: {
    defaultTimezone: 'Asia/Tokyo',
    locales: ['ja']
  },
  /*
   ** dotEnv module configuration
   ** See https://github.com/nuxt-community/dotenv-module#options
   */
  dotenv: {
    path: process.cwd()
  },
  env: {
    BASE_URL: process.env.BASE_URL || 'http://127.0.0.1:3000',
    USE_VCONSOLE: process.env.USE_VCONSOLE || '',
    LIFF_ID: process.env.LIFF_ID || '',
    BOT_FRIENDSHIP_URL: process.env.BOT_FRIENDSHIP_URL || '',
    MC_API_BASE_URL: process.env.MC_API_BASE_URL || 'http://127.0.0.1:3000',
    MC_API_KEY: process.env.MC_API_KEY || 'DUMMY_API_KEY'
  },
  /*
   * Generating page and routes
   */
  generate: {
    routes() {
      console.log('MC_API_URL', `${process.env.MC_API_BASE_URL}sessions`)
      const sessions = axios
        .get(`${process.env.MC_API_BASE_URL}sessions`, {
          headers: { 'X-API-KEY': process.env.MC_API_KEY }
        })
        .then(res => {
          return res.data.contents.map((session: { id: string }) => {
            return '/sessions/' + session.id
          })
        })
      return Promise.all([sessions]).then(values => {
        return values.join().split(',')
      })
    }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    filenames: {
      app: ({ isDev }) => (isDev ? '[name].[hash].js' : '[chunkhash].js'),
      chunk: ({ isDev }) => (isDev ? '[name].[hash].js' : '[chunkhash].js')
    },
    // build options for nuxt-property-decorator
    babel: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient && config && config.module) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

module.exports = nuxtConfig
