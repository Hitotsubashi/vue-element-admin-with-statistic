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
          entry: router.currentRoute.name
        })
    })
    Sentry.captureMessage("user-statistic", {
      level: "info"
    })
  },
  visiting() {
    Sentry.captureMessage('user-statistic:visiting', {
      tags: {
        route: router.currentRoute.name
      },
      level: "info"
    })
  },
  end() {
    if (this.alreadyEnd) return
    this.alreadyEnd = true
    this.endTime = performance.now()
    Sentry.captureMessage("user-statistic:leave", {
      tags: {
        visitDuration: Math.round((this.endTime - this.startTime) / 1000)
      },
      level: "info"
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
