import { Workout } from "../../server/db.js";
import { Page } from "../../sw.js"
import { RoutePage } from "@jon49/sw/routes.js";

const {
    html,
    layout,
    db: { get, getExercises }
} =
    // @ts-ignore
    <Page>page

async function render() {
    let workouts = await get("workouts")
    let exercises = await getExercises()
    return html`
<div id=workouts>
${workoutsView(workouts)}
</div>
<form method=post action="/web/workouts/edit" hf-target="#workouts">
<fieldset>
<legend>New Workout</legend>
<label>Name: <input type=text name=name required maxlength="25"></label>
<label>Description: <input type=text name=description maxlength="50"></label>
<div id=exercises>
    <fieldset>
        <legend>Exercise</legend>
        <select name=exerciseId>
            <option value="">Select an exercise</option>
            ${exercises?.map(x => html`<option value=${x.id}>${x.name}</option>`)}
        </select>
    </fieldset>
</div>
</fieldset>
</form>
    `
}

function workoutsView(workouts: Workout[] | undefined) {
    if (!workouts) return html``
    return html``
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

