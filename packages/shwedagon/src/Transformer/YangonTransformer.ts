import { Project, ts, type FileSystemHost } from "ts-morph"
import { globSync } from "glob"
import path from "path"
import { readFileSync } from "fs"
import ansi from "ansi-colors"

function trimComments(comment: string) {
    if (!comment.startsWith("///")) throw new Error('Unable to trim comments that does not start with ///')
    return comment.replace("///", "").trim()
}

export default class YangonTransformer {
    project: Project
    fs: FileSystemHost
    constructor(compiler: ts.CompilerOptions) {
        const options = {
            ...compiler,
            strictNullChecks: true,
            experimentalDecorators: true,
            emitDecoratorMetadata: true
        }
        if(!options.outDir) options.outDir = "./.yangon"
        this.project = new Project({
            compilerOptions: options,
            // useInMemoryFileSystem: true,
            skipAddingFilesFromTsConfig: true
        })

        this.fs = this.project.getFileSystem()
    }

    compile() {
        this.project.resolveSourceFileDependencies()
        const dia = this.project.getPreEmitDiagnostics()
        if (dia.length > 0) {
            console.log(this.project.formatDiagnosticsWithColorAndContext(dia))

            process.exit(1)
        }
        this.project.emitSync()
    }

    getAllFile(path: string) {
        const allFilePaths: string[] = []

        const getFiles = (p: string) => {
            const dir = this.fs.readDirSync(p)

            for (const file of dir) {
                if(file.isDirectory) {
                    getFiles(file.name)
                } else {
                    allFilePaths.push(file.name)
                }
            }
        }

        getFiles(path)
    
        return allFilePaths
    }

    addDirWithGlob(glob: string) {
        const errors: string[] = []
        const files = globSync(glob)
        const paths = files.map(v => path.join(process.cwd(), v))
        for (let i = 0; i < paths.length; i++) {
            const content = readFileSync(paths[i], "utf-8")
            const error = this.createFile(files[i], content)
            if(error.length > 0) {
                errors.push(
                    `${ansi.bgBlack(ansi.red(" ERROR "))} ${files[i]}\n\n${error.join("\n")}`
                )
            }
        }
        if(errors.length > 0) {
            console.log(errors.join("\n\n"))
            process.exit(1)
        }
    }

    createFolder(folderPath: string) {
        this.fs.mkdirSync(folderPath)
    }

    createFile(name: string, input: string) {
        const errors = []
        const src = this.project.createSourceFile(name, input, {
            overwrite: true
        })
        const imports = src.getImportDeclarations().filter((i) => i.getModuleSpecifier().getText().replace(/("|')/g, "") === "@yangon-framework/shwedagon")
        for (const mod of imports) {
            mod.getModuleSpecifier().replaceWithText("\"@yangon-framework/core\"")
        }

        // decorators
        const classDeclar = src.getClasses()

        for (const classDecl of classDeclar) {
            const children = classDecl.getChildrenOfKind(ts.SyntaxKind.MethodDeclaration)
            for (const method of children) {
                // Modify the arguments of `Command`
                const commandDecorator = method.getDecorator("Command")
                if (!commandDecorator) continue
                const comments = commandDecorator.getLeadingCommentRanges()
                if (comments.length === 0) {
                    errors.push(
                        `Command description not found at ${method.getName()} command

──> ${ansi.gray(`${name}:${method.getStartLineNumber(false)}:${method.getStartLinePos(false)}`)}
| ${ansi.green("/// Command description")}
| ${ansi.red("^^^^^^ This is needed")}
| @${ansi.yellowBright(commandDecorator.getName())}(...)
`
                    )
                } else if (comments.length > 1) console.warn("There are more than one comments to this command. Only counting the 1st one.")
                else {
                    const comment = comments[0].getText()

                    commandDecorator.insertArgument(0, `"${trimComments(comment)}"`)
                }

                const params = method.getParameters()
                params.shift() // this is the ctx param

                for (const param of params) {
                    const deco = param.getDecorator("Option")
                    if (!deco) continue;

                    const descriptions = deco.getLeadingCommentRanges()
                    if (descriptions.length === 0) {
                        errors.push(`Option description not found at ${ansi.bold(method.getName())} for ${param.getName()} option
                        
──> ${ansi.gray(`${name}:${param.getStartLineNumber(false)}:${param.getStartLinePos(false)}`)}
| ${ansi.green("/// Option description")}
| ${ansi.red("^^^^^^ This is needed")}
| @${ansi.yellowBright("Option")}(...)
`)
                    } else if (descriptions.length > 1) console.warn("There are more than one comments to this command. Only counting the 1st one.")
                    else {
                        const desc = descriptions[0].getText()
                        deco.insertArgument(0, `"${trimComments(desc)}"`)
    
                        const optional = param.getType()
                        deco.insertArgument(1, `${!(optional.getText() === "any")}`)
                    }
                }
            }
        }

        // src.saveSync()
        return errors
    }
}