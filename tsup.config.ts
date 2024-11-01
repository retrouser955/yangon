import { defineConfig as defineConfigTsUp, type Options } from "tsup"

export default function defineConfig(config: Options | Options[]) {
    return defineConfigTsUp({
        format: "cjs",
        skipNodeModulesBundle: true,
        ...config
    })
}