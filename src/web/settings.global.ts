import sync from "./api/sync.js"
import { Route } from "@jon49/sw/routes.js"

const routes : Route[] = [
    { route: /^\/web\/$/,
      file: "/web/pages/index.page.js" },
    { route: /workouts\/edit\/$/,
      file: "/web/pages/workouts/edit.page.js" },
    { route: /\/exercises\/$/,
      file: "/web/pages/exercises/edit.page.js" },
    sync,
]

// @ts-ignore
self.app.routes = routes
// @ts-ignore
self.app.version = "v0"

