import path from "node:path"
import { Glob, write } from "bun"

export async function getHTMLMappableFiles(mappers: FileMapper[]) {
    return mappers.filter(x =>
          x.url.endsWith(".css")
          || x.url.includes("/js/")
          || x.url.includes("/images/"))
}

export interface FileMapper {
    url: string
    file: string
}

export async function fileMapper(targetDirectory: string): Promise<FileMapper[]> {
    console.time("File Mapper")
    const glob = new Glob("**/*.{js,css,json,ico,svg,png}")
    let files: string[] = []
    for await (const file of glob.scan(targetDirectory)) {
        files.push(file)
    }

    let mapper = files.map(x => {
        let parsed = path.parse(x)
        let parsed2 = path.parse(parsed.name)
        return {
            url: `/${parsed.dir}/${parsed2.name}${parsed.ext}`,
            file: `/${x}`,
        }
    })
    .filter(x => x.url !== "/web/sw.js")

    // Write mapper to file in src/web/file-map.js
    let fileMap = `export default ${JSON.stringify(mapper)}`
    await write(`src/web/file-map.ts`, fileMap)

    console.timeEnd("File Mapper")
    return mapper
}

