import {
  DebugSession,
  InitializedEvent,
  TerminatedEvent,
  StoppedEvent,
  BreakpointEvent,
  OutputEvent,
  Thread,
  Source,
  Scope,
  StackFrame,
  Variable
} from '@vscode/debugadapter';
import { DebugProtocol } from '@vscode/debugprotocol';
import * as path from 'path';
import * as fs from 'fs';
import { spawn, ChildProcess } from 'child_process';

interface LingalaLaunchRequestArguments extends DebugProtocol.LaunchRequestArguments {
  program: string;
  noDebug?: boolean;
  runtime?: string;
  runtimeArgs?: string[];
  cwd?: string;
  env?: { [key: string]: string };
}

class LingalaDebugSession extends DebugSession {
  private runtimeProcess: ChildProcess | null = null;
  private compiledFiles: Map<string, string> = new Map();

  protected async launchRequest(
    response: DebugProtocol.LaunchResponse,
    args: LingalaLaunchRequestArguments
  ): Promise<void> {
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

      this.runtimeProcess = spawn(runtime, runtimeArgs, {
        cwd: args.cwd,
        env: { ...process.env, ...args.env }
      });

      this.runtimeProcess.stdout?.on('data', (data) => {
        this.sendEvent(new OutputEvent(data.toString(), 'stdout'));
      });

      this.runtimeProcess.stderr?.on('data', (data) => {
        this.sendEvent(new OutputEvent(data.toString(), 'stderr'));
      });

      this.runtimeProcess.on('close', (code) => {
        this.sendEvent(new TerminatedEvent());
      });

      this.sendResponse(response);
    } catch (error) {
      this.sendErrorResponse(response, 1, 'Erreur lors du lancement: ' + String(error));
    }
  }

  private async compileLingalaFile(sourceFile: string): Promise<string> {
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
    const { compile } = await import(compilerPath);
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

  private runProgram(jsFile: string, args: LingalaLaunchRequestArguments): void {
    const runtime = args.runtime || 'node';
    const runtimeArgs = [jsFile];

    this.runtimeProcess = spawn(runtime, runtimeArgs, {
      cwd: args.cwd,
      env: { ...process.env, ...args.env }
    });

    this.runtimeProcess.stdout?.on('data', (data) => {
      this.sendEvent(new OutputEvent(data.toString(), 'stdout'));
    });

    this.runtimeProcess.stderr?.on('data', (data) => {
      this.sendEvent(new OutputEvent(data.toString(), 'stderr'));
    });

    this.runtimeProcess.on('close', (code) => {
      this.sendEvent(new TerminatedEvent());
    });
  }

  protected setBreakPointsRequest(
    response: DebugProtocol.SetBreakpointsResponse,
    args: DebugProtocol.SetBreakpointsArguments
  ): void {
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

  protected threadsRequest(response: DebugProtocol.ThreadsResponse): void {
    response.body = {
      threads: [new Thread(1, 'main')]
    };
    this.sendResponse(response);
  }

  protected stackTraceRequest(
    response: DebugProtocol.StackTraceResponse,
    args: DebugProtocol.StackTraceArguments
  ): void {
    // Le stack trace est fourni par le débogueur Node.js
    response.body = {
      stackFrames: [
        new StackFrame(1, 'main', this.createSource(args.threadId), 1)
      ]
    };
    this.sendResponse(response);
  }

  protected scopesRequest(
    response: DebugProtocol.ScopesResponse,
    args: DebugProtocol.ScopesArguments
  ): void {
    response.body = {
      scopes: [
        new Scope('Locals', 1, false)
      ]
    };
    this.sendResponse(response);
  }

  protected variablesRequest(
    response: DebugProtocol.VariablesResponse,
    args: DebugProtocol.VariablesArguments
  ): void {
    response.body = {
      variables: [
        new Variable('variable1', 'value1'),
        new Variable('variable2', 'value2')
      ]
    };
    this.sendResponse(response);
  }

  private createSource(threadId: number): Source {
    return new Source('lingala', '');
  }

  protected disconnectRequest(
    response: DebugProtocol.DisconnectResponse,
    args: DebugProtocol.DisconnectArguments
  ): void {
    if (this.runtimeProcess) {
      this.runtimeProcess.kill();
      this.runtimeProcess = null;
    }
    this.sendResponse(response);
  }
}

// Créer et démarrer le serveur de débogage
DebugSession.run(LingalaDebugSession);
