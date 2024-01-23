import { ValidationResult } from "promise-validation"
import { getResponse, options } from "@jon49/sw/routes.js"
import layout from "./pages/_layout.html.js"
import * as db from "./server/db.js"
import html from "html-template-tag-stream"
import * as validation from "promise-validation"
import * as validators from "@jon49/sw/validation.js"

// @ts-ignore
let version: string = self.app.version

let page = {
    layout,
    html,
    db,
    validation: { ...validation, ...validators }
}

export type Page = typeof page

self.addEventListener('message', async function (event) {
    if (event.data === "skipWaiting") {
        // @ts-ignore
        self.skipWaiting()
    }
})

self.addEventListener("install", (e: Event) => {
    console.log("Service worker installed.")

    // @ts-ignore
    e.waitUntil(caches.open(version).then(async cache => {
        console.log("Caching files.")
        // @ts-ignore
        return cache.addAll(self.app.links.map(x => x.file))
    }))
})

function handleErrors(errors: any) {
    if (errors instanceof ValidationResult) {
        return errors.reasons.map(x => x.reason)
    }
    return []
}

// @ts-ignore
self.addEventListener("fetch", (e: FetchEvent) => {
    if (!options.handleErrors) {
        options.handleErrors = handleErrors
        options.page = page
    }
    e.respondWith(getResponse(e))
})

// @ts-ignore
self.addEventListener("activate", async (e: ExtendableEvent) => {
    console.log("Service worker activated.")

    let keys = await caches.keys(),
        deleteMe =
        keys
        .map((x: string) =>
             ((version !== x)
              && caches.delete(x)))
        .filter(x => x)
    if (deleteMe.length === 0) return
    e.waitUntil(Promise.all(deleteMe))
})

self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        console.log("Skip waiting!")
        // @ts-ignore
        return self.skipWaiting()
    }
})

