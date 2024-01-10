import sync from "./api/sync.js"
import { Route } from "@jon49/sw/routes.js"

export const routes : Route[] = [
    { route: /^\/web\/$/,
      file: "/web/pages/index.page.js", },
    sync,
]

