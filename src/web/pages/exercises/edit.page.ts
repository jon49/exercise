import { Page } from "../../server/shared.global.js"
import { RoutePage } from "@jon49/sw/routes.js"

const {
    html,
    layout,
    // db: { get, getAllExercises }
}: Page =
    // @ts-ignore
    self.app

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

