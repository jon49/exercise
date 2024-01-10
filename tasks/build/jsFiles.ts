import { Glob, file, write } from "bun"
import { rmAll } from "./system"
import path from "node:path"

const pageGlob = new Glob("**/*.page.ts")

let bundleFiles: string[] = []
for await (const file of pageGlob.scan("./src")) {
    bundleFiles.push(`./src/${file}`)
}

let staticFiles: string[] = []
for await (const file of new Glob("**/js/*.{js,ts}").scan("./src")) {
    if (file.includes(".bundle.")) {
        bundleFiles.push(`./src/${file}`)
    } else if (!path.basename(file).startsWith("_")) {
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

    for await (const page of new Glob("**/*\\.page.*.js").scan(targetDirectory)) {
        let bunFile = file(`${targetDirectory}/${page}`)
        let content = await bunFile.text()
        let matched = content.match(/,(\S*)=(\S*);export/)
        if (matched) {
            let [, name, value] = matched
            content = content.replace(`,${name}=${value}`, "")
            content = content.replace(
                `export{${name} as default}`,
                `return ${value}`)
        } else {
            let matched = content.match(/var (\S*) = (\S*);\sexport \{\s.*\s.*/)
            if (!matched) {
                continue
            }
            content = content.replace(matched[0], `return ${matched[2]};`)
        }
        await write(bunFile, content)
    }

    console.timeEnd("Building JS")
}

