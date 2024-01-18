import { rm } from "node:fs/promises"
import { Glob, write } from "bun"

export async function handleSw(targetDirectory: string, isProd: boolean) {
    console.time("Building SW")

    let hashedSwGlob = new Glob("**/sw.*.js")

    for await (const file of hashedSwGlob.scan(targetDirectory)) {
        console.log(`Removing ${file}`)
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
        console.log(`Writing ${hashedFile}`)
        await write(
            `${targetDirectory}/web/sw.js`,
            `importScripts("/${hashedFile}");
self._install("/${hashedFile}");`)
    }

    console.timeEnd("Building SW")
}
