import defineConfig from "../../tsup.config"

export default defineConfig({
    entry: ['./lib/index.ts'],
    dts: true
})