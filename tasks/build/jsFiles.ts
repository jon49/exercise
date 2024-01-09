import { Glob } from "bun"
import { rmAll } from "./system"
import path from "node:path"

const glob = new Glob("**/.page.ts")

let bundleFiles: string[] = []
for await (const file of glob.scan("./src")) {
    console.log("Found bundle page file", file)
    bundleFiles.push(`./src/${file}`)
}

let staticFiles: string[] = []
for await (const file of new Glob("**/js/*.{js,ts}").scan("./src")) {
    if (file.includes(".bundle.")) {
        console.log("Found bundle file", file)
        bundleFiles.push(`./src/${file}`)
    } else if (!path.basename(file).startsWith("_")) {
        console.log("Found static file", file)
        staticFiles.push(`./src/${file}`)
    }
}

export async function buildJS(isProd: boolean, targetDirectory: string) {
    console.time("Building JS")
    // Remove old files
    let jsGlob = new Glob("**/*.js")
    await rmAll(targetDirectory, jsGlob, filename =>
            filename.includes(".bundle.")
            || filename.includes(".page.")
            || filename.includes("/js/"))

    await Bun.build({
        entrypoints: bundleFiles,
        outdir: targetDirectory,
        minify: isProd,
        format: "esm",
        naming: "[dir]/[name].[hash].[ext]",
        root: "./src",
        target: "browser",
    })

    await Bun.build({
        entrypoints: staticFiles,
        outdir: targetDirectory,
        minify: isProd,
        format: "esm",
        naming: "[dir]/[name].[hash].[ext]",
        root: "./src",
        target: "browser",
        external: ["*"],
    })

    console.timeEnd("Building JS")
}

