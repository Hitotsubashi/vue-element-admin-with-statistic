import * as Sentry from "@sentry/vue"
import router from '@/router'
import { getUsername } from "@/utils/auth"

export const sentryStatisticRecorder = {
  startTime: undefined,
  endTime: undefined,
  alreadyEnd: false,
  // 统计PV、UV、IP数、来源、入口页面
  start() {
    this.alreadyEnd = false
    this.startTime = performance.now()
    Sentry.configureScope((scope) => {
      scope
        .setUser({
          username: getUsername()
        })
        .setTags({
          referrer: document.referrer || '地址栏直接键入',
          entry: router.currentRoute.name,
          screen: `${window.screen.width}x${window.screen.height}`
        })
    })
    Sentry.captureMessage("user-statistic", {
      level: "info"
    })
  },
  visiting() {
    Sentry.withScope((scope) => {
      scope.setTag('route', router.currentRoute.name)
      Sentry.captureMessage('user-statistic:visiting', {
        level: "info"
      })
    })
  },
  end() {
    if (this.alreadyEnd) return
    this.alreadyEnd = true
    this.endTime = performance.now()
    Sentry.withScope((scope) => {
      scope.setUser({
        ...scope.getUser(),
        visitDuration: Math.round((this.endTime - this.startTime) / 1000)
      })
      Sentry.captureMessage("user-statistic:leave", {
        level: "info"
      })
    })
  }
}

export default {
  beforeDestroy() {
    sentryStatisticRecorder.end()
  },
  watch: {
    '$route': {
      handler() {
        sentryStatisticRecorder.visiting()
      },
      immediate: true
    }
  }
}
