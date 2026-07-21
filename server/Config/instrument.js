// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"
// import {nodeProfilingIntegration} from '@sentry/profiling-node'

Sentry.init({
  dsn: "https://7ce2aaba7364e5c4a6d554bb489cf11e@o4511768746983425.ingest.us.sentry.io/4511768754257920",
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },
  integrations: [
    // nodeProfilingIntegration(),
    Sentry.mongooseIntegration()
  ]
});