import defineConfig from "../../tsup.config"

export default defineConfig({
    entry: ['./src/index.ts', './src/CLI/index.ts'],
    dts: true
})