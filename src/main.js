import Vue from "vue"

import Cookies from "js-cookie"

import "normalize.css/normalize.css" // a modern alternative to CSS resets

import Element from "element-ui"
import "./styles/element-variables.scss"
import enLang from "element-ui/lib/locale/lang/en" // 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import "@/styles/index.scss" // global css

import App from "./App"
import store from "./store"
import router from "./router"

import "./icons" // icon
import "./permission" // permission control
import "./utils/error-log" // error log

import StatisticMixin from './mixin/statistic-mixin'

import * as filters from "./filters" // global filters
import * as Sentry from "@sentry/vue"
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === "production") {
  const { mockXHR } = require("../mock")
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get("size") || "medium", // set element-ui default size
  locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Sentry.init({
  Vue,
  environment: process.env.NODE_ENV,
  dsn: "https://88272eda9dcc4dacad9c80e5a25a976b@o4505125880594432.ingest.sentry.io/4505148109357056",
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router)
    }),
    new Sentry.Replay()
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

new Vue({
  el: "#app",
  router,
  store,
  mixins: [StatisticMixin],
  render: (h) => h(App)
})
