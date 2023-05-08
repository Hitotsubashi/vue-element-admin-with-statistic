import * as Sentry from "@sentry/vue"
import { mapGetters } from "vuex"

export default {
  mounted() {
    Sentry.captureMessage('user-statistic', {
      user: {
        username: this.username
      },
      level: 'info'
    })
  },
  computed: {
    ...mapGetters({ username: 'name' })
  }
}
