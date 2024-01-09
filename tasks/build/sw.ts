export async function handleSw(targetDirectory: string, isProd: boolean) {
    console.time("Building SW")
    await Bun.build({
        entrypoints: ["./src/web/sw.ts"],
        outdir: targetDirectory,
        minify: isProd,
        format: "esm",
        root: "./src",
        target: "browser",
        // naming: "[dir]/[name].[ext]",
    })
    console.timeEnd("Building SW")
}
