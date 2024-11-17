import { Project, ts, type FileSystemHost } from "ts-morph"

function trimComments(comment: string) {
    if (!comment.startsWith("///")) throw new Error('Unable to trim comments that does not start with ///')
    return comment.replace("///", "").trim()
}

export default class YangonTransformer {
    project: Project
    fs: FileSystemHost
    constructor(compiler: ts.CompilerOptions) {
        this.project = new Project({
            compilerOptions: {
                ...compiler,
                strictNullChecks: true,
                experimentalDecorators: true,
                emitDecoratorMetadata: true
            },
            useInMemoryFileSystem: true
        })

        this.fs = this.project.getFileSystem()
    }

    createFolder(folderPath: string) {
        this.fs.mkdirSync(folderPath)
    }

    createFile(name: string, input: string) {
        const src = this.project.createSourceFile(name, input)
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
                if (comments.length === 0) throw new Error("No commend description found")
                if (comments.length > 1) console.warn("There are more than one comments to this command. Only counting the 1st one.")
                const comment = comments[0].getText()

                commandDecorator.insertArgument(0, `"${trimComments(comment)}"`)

                const params = method.getParameters()
                params.shift() // this is the ctx param

                for (const param of params) {
                    const deco = param.getDecorator("Option")
                    if (!deco) continue;

                    const descriptions = deco.getLeadingCommentRanges()
                    if (descriptions.length > 1) console.warn("There are more than one comments to this command. Only counting the 1st one.")

                    const desc = descriptions[0].getText()
                    deco.insertArgument(0, `"${trimComments(desc)}"`)

                    const optional = param.getType()
                    deco.insertArgument(1, `${!(optional.getText() === "any")}`)
                }
            }
        }

        src.saveSync()
    }
}

const transfomer = new YangonTransformer({
    target: ts.ScriptTarget.ESNext,
    outDir: "./dist"
})
const input = `
import { Command, Option } from "@yangon-framework/shwedagon"
import { CommandInteraction } from "eris"
import { StringOption } from "@yangon-framework/core"

export default class SayCommand {
    /// Repeat something from the bot
    @Command()
    async say(
        ctx: CommandInteraction,
        /// Content to repeat
        @Option()
        content: StringOption
    ) {
        ctx.createMessage(content)
    }
}
`.trim()
transfomer.createFolder("./files")
transfomer.createFile("./files/hello.ts", input)

transfomer.project.emitSync()

console.log(transfomer.fs.readDirSync("./"))