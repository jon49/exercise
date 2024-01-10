import { rm } from "node:fs/promises"
import { Glob, write } from "bun"
import { findHashedFile } from "./system"

export async function handleSw(targetDirectory: string, isProd: boolean) {
    console.time("Building SW")

    let hashedSwGlob = new Glob("**/sw.*.js")

    for await (const file of hashedSwGlob.scan(targetDirectory)) {
        await rm(`${targetDirectory}/${file}`)
    }

    await Bun.build({
        entrypoints: ["./src/web/sw.ts"],
        format: "esm",
        minify: isProd,
        naming: "[dir]/[name].[hash].[ext]",
        outdir: targetDirectory,
        root: "./src",
        target: "browser",
    })

    for await (const hashedFile of hashedSwGlob.scan(targetDirectory)) {
        await write(
            `${targetDirectory}/web/sw.js`,
            `importScripts("/${hashedFile}")`)
    }

    console.timeEnd("Building SW")
}
