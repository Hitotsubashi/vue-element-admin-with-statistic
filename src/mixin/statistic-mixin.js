import * as Sentry from "@sentry/vue"
import { mapGetters } from "vuex"

export default {
  data() {
    return {
      startTime: undefined,
      endTime: undefined
    }
  },
  mounted() {
    this.uploadVisitData()
    this.uploadVisitDuration()
  },
  methods: {
    // 统计PV、UV、IP数、来源、入口页面
    uploadVisitData() {
      Sentry.captureMessage("user-statistic", {
        user: {
          username: this.username
        },
        tags: {
          referrer: document.referrer || '地址栏直接键入',
          entry: this.$route.name
        },
        level: "info"
      })
    },
    // 统计跳出率和平均访问时长
    uploadVisitDuration() {
      this.$once("hook:mounted", () => {
        this.startTime = performance.now()
      })
      this.$once("hook:beforeDestroy", () => {
        this.endTime = performance.now()
        Sentry.captureMessage("user-statistic:leave", {
          tags: {
            visitDuration: Math.round((this.endTime - this.startTime) / 1000)
          },
          level: "info"
        })
      })
    },
    // 统计受访页面
    uploadVisitingData() {
      Sentry.captureMessage('user-statistic:visiting', {
        tags: {
          route: this.$route.name
        }
      })
    }
  },
  watch: {
    '$route': {
      handler() {
        this.uploadVisitingData()
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters({ username: "name" })
  }
}
