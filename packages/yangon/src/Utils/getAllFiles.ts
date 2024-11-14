import { readdirSync } from "fs";
import path, { join } from "path";

export function getAllFiles(dir: string) {
    const allFilePaths: string[] = []

    const getFiles = (dir: string) => {
        const allFiles = readdirSync(dir, { withFileTypes: true }).filter(v => v.isDirectory() || v.name.endsWith(".js"))

        for (const file of allFiles) {
            if (file.isDirectory()) {
                getFiles(join(file.parentPath, file.name))
            } else {
                allFilePaths.push(join(file.parentPath, file.name))
            }
        }
    }

    getFiles(dir)

    return allFilePaths
}