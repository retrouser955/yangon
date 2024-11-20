#!usr/bin/env node
import path from "path"
import { getCompilerOptionsFromTsConfig } from "ts-morph"
import YangonTransformer from "../Transformer/YangonTransformer"
import { readFileSync } from "fs"
import ora from "ora-classic"
import ansiColors from "ansi-colors"

const DEFAULT_TSCONFIG = "tsconfig.json"
const TS_CONFIG_PATH = path.join(process.cwd(), DEFAULT_TSCONFIG)

const config = getCompilerOptionsFromTsConfig(TS_CONFIG_PATH);

const art = [
    ' __     __                           ',
    ' \\ \\   / /                           ',
    '  \\ \\_/ /_ _ _ __   __ _  ___  _ __  ',
    "   \\   / _` | '_ \\ / _` |/ _ \\| '_ \\ ",
    '    | | (_| | | | | (_| | (_) | | | |',
    '    |_|\\__,_|_| |_|\\__, |\\___/|_| |_|',
    '                    __/ |            ',
    '                   |___/             '
  ]

console.log(ansiColors.yellow(art.join("\n")))
const version = require("../../package.json").version
console.log(`\n${ansiColors.bgBlue(ansiColors.white(" SHWEDAGON "))} ${version}`)
const builder = new YangonTransformer(config.options)

const spinner = ora({
    text: "Transpiling TypeScript",
    spinner: "moon"
}).start()

const fileGlob = JSON.parse(readFileSync(TS_CONFIG_PATH, "utf-8")).include
if(!fileGlob) throw new Error("Cannot find glob of the files that are to be included")

for (const glob of fileGlob) {
    builder.addDirWithGlob(glob, spinner)
}

builder.compile(spinner)

spinner.stop()
console.log(`            Finished transpiling TypeScript`)