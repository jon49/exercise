// import { Exercise, Workout } from "../../server/db.js"
import { Page } from "../../sw.js"
import { RoutePage } from "@jon49/sw/routes.js"

const {
    html,
    layout,
    // db: { get, getAllExercises }
} =
    // @ts-ignore
    <Page>app

async function render() {
    return html`yes`
}

const route: RoutePage = {
    get: async () => {
        return layout({
            main: await render(),
            title: "Exercises",
        })
    }
}

export default route

