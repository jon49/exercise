import layout from "../pages/_layout.html.js"
import * as db from "../server/db.js"
import html from "html-template-tag-stream"
import * as validation from "promise-validation"
import * as validators from "@jon49/sw/validation.js"

let page = {
    layout,
    html,
    db,
    validation: { ...validation, ...validators }
}

// @ts-ignore
Object.assign(self.app, page)

export type Page = typeof page

