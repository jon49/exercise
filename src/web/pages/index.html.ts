import html from "html-template-tag-stream";
import { get } from "../server/db.js";
import { Route } from "@jon49/sw/routes.js";
import layout from "./_layout.html.js";

async function render() {
    let workouts = await get("workouts")
    return html`
<h1>Workouts</h1>
${!workouts && html`<p>No workouts yet. <a href="/web/workouts/edit">Make one here.</a></p>`}
    `
}

const route: Route = {
    route: /\/web\/?$/,
    get: async () => {
        return layout({
            main: await render(),
            title: "Available Workouts",
        })
    }
}

export default route

