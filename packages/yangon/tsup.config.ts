import defineConfig from "../../tsup.config"

defineConfig({
    dts: true,
    entry: ["./lib/index.ts"]
})