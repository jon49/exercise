import workouts from "./pages/index.html.js"
import sync from "./api/sync.js"
import { Route } from "@jon49/sw/routes.js"

export const routes : Route[] = [
    workouts,
    sync,
]

