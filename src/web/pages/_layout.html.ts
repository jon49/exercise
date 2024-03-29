import html from "html-template-tag-stream"
import db from "../server/global.js"
import { syncCountView } from "../api/sync.js"
import { themeView } from "../api/settings.js"
import { when } from "@jon49/sw/utils.js"

// @ts-ignore
let version: string = self.app.version

interface Nav {
    name: string
    url: string
}

const render = async (
    { main,
        head,
        scripts,
        nav,
        title,
        bodyAttr,
    }: LayoutTemplateArguments) => {
    const [isLoggedIn, updated, { theme }] = await Promise.all([
        db.isLoggedIn(),
        db.updated(),
        db.settings()
    ])
    const updatedCount = updated.length

    return html`
<!DOCTYPE html>
<html>
 <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Weight</title>
    <link rel="icon" type="image/x-icon" href="/web/images/index.ico">
    <link href="/web/css/index.css" rel=stylesheet>
    <link href="/web/css/app.css" rel=stylesheet>
    <!-- <link rel="manifest" href="/web/manifest.json"> -->
</head>
<body $${when(theme, x => `class=${x}`)} $${bodyAttr}>
    <script> window.app = { scripts: new Map() } </script>
    <div id=head>$${head}</div>
    <header>
        <div id=sw-message></div>
        <div class=header>
            <a href="/web"><img style="height:2.25em;" src="/web/images/index.svg"></img></a>
            <div>
                <form method=post action="/web/api/settings?handler=theme" class=inline>
                    ${themeView(theme)}
                </form>

               <form method=post action="/web/api/sync?handler=force" class=inline>
                   <button id=sync-count class=bg>${syncCountView(updatedCount)}</button>
               </form>

                ${isLoggedIn
                    ? html`<a href="/login?logout">Logout</a>`
                    : html`<a href="/login">Login</a>`}
            </div>
        </div>
        <nav id=nav-main>
            <ul>
                <li><a href="/web/entries">Entries</a></li>
                <li><a href="/web/entries/edit">Add/Edit</a></li>
                <li><a href="/web/charts">Charts</a></li>
                <li><a href="/web/user-settings/edit">User Settings</a></li>
                ${when(nav?.length, () =>
                       nav?.map(x => html`<li><a href="$${x.url}">${x.name}</a></li>`))}
            </ul>
        </nav>
    </header>
    <main>
        ${main}
    </main>

    <template id=toast-template><dialog class=toast is=x-toaster open><p class=message></p></dialog></template>
    <div id=toasts></div>
    <div id=dialogs></div>

    <footer><p>${version}</p></footer>

    <form
        id=href

        is=form-subscribe
        data-event="refresh"

        hf-select="title,#head,#nav-main,main,#errors,#toasts,#scripts">
        <button id=href-nav class=hidden></button>
    </form>

    <form
        id=get-sync-count-form
        action="/web/api/sync?handler=count"

        is=form-subscribe
        data-event="hf:completed"
        data-match="detail: {method:'post'}"

        hf-scroll-ignore
        hf-target="#sync-count"></form>

    <script type="module" src="/web/js/app.bundle.js"></script>
    <div id=scripts>${(scripts ?? []).map(x => html`<script src="${x}"></script>`)}</div>
</body>
</html>`
}

export default
    async function layout(o: LayoutTemplateArguments) {
    return render(o)
}

export type Layout = typeof layout

export interface LayoutTemplateArguments {
    title: string
    head?: string
    bodyAttr?: string
    main?: AsyncGenerator<any, void, unknown>
    scripts?: string[]
    nav?: Nav[]
}


