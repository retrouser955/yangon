import path from "node:path"
import fs from "node:fs"

export function getAllFilesInDir(dir: string) {
    const allFiles: string[] = []
    const getFiles = (p: string) => {
        const dir = fs.readdirSync(p, { withFileTypes: true })
            .filter(v => v.isDirectory() || v.name.endsWith(".js"))

        for(const file of dir) {
            if(file.isDirectory()) {
                getFiles(path.join(p, file.name))
            } else {
                allFiles.push(path.join(p, file.name))
            }
        }
    }

    getFiles(dir)

    return allFiles
}