import { Page } from "../../sw.js"
import { RoutePage } from "@jon49/sw/routes.js";

// @ts-ignore
const { html, layout, db: { get } } = <Page>page

async function render() {
    return html`Yes!`
}

const route: RoutePage = {
    get: async () => {
        return layout({
            main: await render(),
            title: "Available Workouts",
        })
    }
}

export default route

