"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debugadapter_1 = require("@vscode/debugadapter");
const path = require("path");
const fs = require("fs");
const child_process_1 = require("child_process");
class LingalaDebugSession extends debugadapter_1.DebugSession {
    constructor() {
        super(...arguments);
        this.runtimeProcess = null;
        this.compiledFiles = new Map();
    }
    async launchRequest(response, args) {
        try {
            // Compiler le fichier .lingala en JavaScript
            const sourceFile = args.program;
            const jsFile = await this.compileLingalaFile(sourceFile);
            this.compiledFiles.set(sourceFile, jsFile);
            // Si noDebug est true, lancer simplement le programme
            if (args.noDebug) {
                this.runProgram(jsFile, args);
                this.sendResponse(response);
                return;
            }
            // Lancer avec Node.js pour le débogage
            const runtime = args.runtime || 'node';
            const runtimeArgs = [
                ...(args.runtimeArgs || []),
                '--inspect-brk=9229',
                jsFile
            ];
            this.runtimeProcess = (0, child_process_1.spawn)(runtime, runtimeArgs, {
                cwd: args.cwd,
                env: { ...process.env, ...args.env }
            });
            this.runtimeProcess.stdout?.on('data', (data) => {
                this.sendEvent(new debugadapter_1.OutputEvent(data.toString(), 'stdout'));
            });
            this.runtimeProcess.stderr?.on('data', (data) => {
                this.sendEvent(new debugadapter_1.OutputEvent(data.toString(), 'stderr'));
            });
            this.runtimeProcess.on('close', (code) => {
                this.sendEvent(new debugadapter_1.TerminatedEvent());
            });
            this.sendResponse(response);
        }
        catch (error) {
            this.sendErrorResponse(response, 1, 'Erreur lors du lancement: ' + String(error));
        }
    }
    async compileLingalaFile(sourceFile) {
        const sourcePath = path.resolve(sourceFile);
        const sourceDir = path.dirname(sourcePath);
        const fileName = path.basename(sourcePath, '.lingala');
        const jsFile = path.join(sourceDir, fileName + '.js');
        // Vérifier si le fichier source existe
        if (!fs.existsSync(sourcePath)) {
            throw new Error(`Fichier source introuvable: ${sourcePath}`);
        }
        // Utiliser le compilateur LingalaAutomation
        const compilerPath = path.join(__dirname, '..', '..', '..', '..', 'dist', 'compiler.js');
        // Importer dynamiquement le compilateur
        const { compile } = await Promise.resolve(`${compilerPath}`).then(s => require(s));
        const source = fs.readFileSync(sourcePath, 'utf8');
        const javascript = compile(source, true, false); // Utiliser AST
        fs.writeFileSync(jsFile, javascript, 'utf8');
        // Copier les modules runtime
        const modules = ['automation.js', 'types.js', 'classes.js', 'http.js', 'html.js', 'server.js', 'css.js', 'errors.js', 'database.js', 'templates.js', 'testing.js', 'standards.js', 'runtime.js'];
        const distDir = path.join(__dirname, '..', '..', '..', '..', 'dist');
        for (const module of modules) {
            const src = path.join(distDir, module);
            const dest = path.join(sourceDir, module);
            if (fs.existsSync(src)) {
                fs.copyFileSync(src, dest);
            }
        }
        return jsFile;
    }
    runProgram(jsFile, args) {
        const runtime = args.runtime || 'node';
        const runtimeArgs = [jsFile];
        this.runtimeProcess = (0, child_process_1.spawn)(runtime, runtimeArgs, {
            cwd: args.cwd,
            env: { ...process.env, ...args.env }
        });
        this.runtimeProcess.stdout?.on('data', (data) => {
            this.sendEvent(new debugadapter_1.OutputEvent(data.toString(), 'stdout'));
        });
        this.runtimeProcess.stderr?.on('data', (data) => {
            this.sendEvent(new debugadapter_1.OutputEvent(data.toString(), 'stderr'));
        });
        this.runtimeProcess.on('close', (code) => {
            this.sendEvent(new debugadapter_1.TerminatedEvent());
        });
    }
    setBreakPointsRequest(response, args) {
        // Pour le débogage via Node.js, les breakpoints sont gérés par le débogueur Node.js
        // Nous utilisons source maps pour mapper les lignes .lingala vers .js
        response.body = {
            breakpoints: args.breakpoints?.map(bp => ({
                verified: true,
                line: bp.line
            })) || []
        };
        this.sendResponse(response);
    }
    threadsRequest(response) {
        response.body = {
            threads: [new debugadapter_1.Thread(1, 'main')]
        };
        this.sendResponse(response);
    }
    stackTraceRequest(response, args) {
        // Le stack trace est fourni par le débogueur Node.js
        response.body = {
            stackFrames: [
                new debugadapter_1.StackFrame(1, 'main', this.createSource(args.threadId), 1)
            ]
        };
        this.sendResponse(response);
    }
    scopesRequest(response, args) {
        response.body = {
            scopes: [
                new debugadapter_1.Scope('Locals', 1, false)
            ]
        };
        this.sendResponse(response);
    }
    variablesRequest(response, args) {
        response.body = {
            variables: [
                new debugadapter_1.Variable('variable1', 'value1'),
                new debugadapter_1.Variable('variable2', 'value2')
            ]
        };
        this.sendResponse(response);
    }
    createSource(threadId) {
        return new debugadapter_1.Source('lingala', '');
    }
    disconnectRequest(response, args) {
        if (this.runtimeProcess) {
            this.runtimeProcess.kill();
            this.runtimeProcess = null;
        }
        this.sendResponse(response);
    }
}
// Créer et démarrer le serveur de débogage
debugadapter_1.DebugSession.run(LingalaDebugSession);
//# sourceMappingURL=debugAdapter.js.map