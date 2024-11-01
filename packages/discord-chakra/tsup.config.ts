import defineConfig from "../../tsup.config";

export default defineConfig({
    outDir: "./dist",
    dts: true,
    entry: ["./lib/index.ts"]
})