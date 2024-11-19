#!usr/bin/env node
import path from "path"
import { getCompilerOptionsFromTsConfig } from "ts-morph"
import YangonTransformer from "../Transformer/YangonTransformer"
import { readFileSync } from "fs"

const DEFAULT_TSCONFIG = "tsconfig.json"
const TS_CONFIG_PATH = path.join(process.cwd(), DEFAULT_TSCONFIG)

const config = getCompilerOptionsFromTsConfig(TS_CONFIG_PATH)

config.options.outDir = config.options.outDir?.replace(process.cwd(), "")

const builder = new YangonTransformer(config.options)

const fileGlob = JSON.parse(readFileSync(TS_CONFIG_PATH, "utf-8")).include
if(!fileGlob) throw new Error("Cannot find glob of the files that are to be included")

for (const glob of fileGlob) {
    builder.addDirWithGlob(glob)
}
builder.compile()

builder.saveOutFiles()