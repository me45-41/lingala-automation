import * as vscode from 'vscode';
import * as path from 'path';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
  console.log('LingalaAutomation extension is now active!');

  // Chemin vers le serveur LSP
  const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

  // Options du serveur
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
  };

  // Options du client
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'lingala' }],
    synchronize: {
      configurationSection: 'lingalaAutomation',
      fileEvents: vscode.workspace.createFileSystemWatcher('**/.lingala')
    }
  };

  // Créer et démarrer le client LSP
  client = new LanguageClient(
    'lingalaAutomation',
    'LingalaAutomation Language Server',
    serverOptions,
    clientOptions
  );

  client.start().then(() => {
    console.log('LingalaAutomation Language Server started!');
  });
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
