import { Page } from "../sw.js"
import { RoutePage } from "@jon49/sw/routes.js";

// @ts-ignore
const { html, layout, db: { get } } = <Page>app

async function render() {
    let workouts = await get("workouts")
    return html`
<h1>Workouts</h1>
${!workouts && html`<p>No workouts yet. <a href="/web/workouts/edit">Make one here.</a></p>`}
    `
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

