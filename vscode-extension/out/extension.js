"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const path = require("path");
const node_1 = require("vscode-languageclient/node");
let client;
function activate(context) {
    console.log('LingalaAutomation extension is now active!');
    // Chemin vers le serveur LSP
    const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
    // Options du serveur
    const serverOptions = {
        run: { module: serverModule, transport: node_1.TransportKind.ipc },
        debug: { module: serverModule, transport: node_1.TransportKind.ipc, options: debugOptions }
    };
    // Options du client
    const clientOptions = {
        documentSelector: [{ scheme: 'file', language: 'lingala' }],
        synchronize: {
            configurationSection: 'lingalaAutomation',
            fileEvents: vscode.workspace.createFileSystemWatcher('**/.lingala')
        }
    };
    // Créer et démarrer le client LSP
    client = new node_1.LanguageClient('lingalaAutomation', 'LingalaAutomation Language Server', serverOptions, clientOptions);
    client.start().then(() => {
        console.log('LingalaAutomation Language Server started!');
    });
}
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
//# sourceMappingURL=extension.js.map