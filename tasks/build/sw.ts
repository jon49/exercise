import { Glob, write, file } from "bun"

export async function handleSw(targetDirectory: string) {
    console.time("Building SW")

    let swHashedFile = ""
    for await (const x of new Glob("**/sw.*.js").scan(targetDirectory)) {
        swHashedFile = x
        let bunFile = file(`${targetDirectory}/${x}`)
        let content = await bunFile.text()
        if (!content.startsWith("(() => {")) {
            await write(bunFile, `(() => {\n${content}\n})()`)
        }
    }

    let fileMapperHashedFile = ""
    for await (const x of new Glob("**/file-map.*.js").scan(targetDirectory)) {
        fileMapperHashedFile = x
    }

    let globals: string[] = []
    for await (const x of new Glob("**/settings.global.*.js").scan(targetDirectory)) {
        globals.push(x)
    }

    await write(
        `${targetDirectory}/web/sw.js`,
        `importScripts("/${fileMapperHashedFile}",${globals.map(x => `"/${x}"`).join(",")},"/${swHashedFile}")`)

    console.timeEnd("Building SW")
}
