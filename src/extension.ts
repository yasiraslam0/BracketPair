import { commands, ExtensionContext, window, workspace, env, Uri } from "vscode";
import DocumentDecorationManager from "./documentDecorationManager";

export function activate(context: ExtensionContext) {
    let documentDecorationManager = new DocumentDecorationManager();

    const configuration = workspace.getConfiguration("bracketPairColorizer", undefined);
    let noticeKey = "depreciation-notice";
    var showNotice = configuration.get(noticeKey);
    if (showNotice) {
        window.showInformationMessage(
            "Bracket Pair Colorizer is no longer being maintained.",
            { title: "Learn more" },
            { title: "Don't show again" }
        ).then(e => {

            if (e?.title == "Learn more") {
                env.openExternal(Uri.parse('https://github.com/CoenraadS/BracketPair#readme'));
            }

            if (e?.title == "Don't show again") {
                configuration.update(noticeKey, false, true)
            }
        });
    }

    context.subscriptions.push(
        commands.registerCommand("bracket-pair-colorizer.expandBracketSelection", () => {
            const editor = window.activeTextEditor;
            if (!editor) { return; }
            documentDecorationManager.expandBracketSelection(editor);
        }),

        commands.registerCommand("bracket-pair-colorizer.undoBracketSelection", () => {
            const editor = window.activeTextEditor;
            if (!editor) { return; }
            documentDecorationManager.undoBracketSelection(editor);
        }),

        workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration("bracketPairColorizer") ||
                event.affectsConfiguration("editor.lineHeight") ||
                event.affectsConfiguration("editor.fontSize")

            ) {
                documentDecorationManager.Dispose();
                documentDecorationManager = new DocumentDecorationManager();
                documentDecorationManager.updateAllDocuments();
            }
        }),

        window.onDidChangeVisibleTextEditors(() => {
            documentDecorationManager.updateAllDocuments();
        }),
        workspace.onDidChangeTextDocument((event) => {
            documentDecorationManager.onDidChangeTextDocument(event);
        }),
        workspace.onDidCloseTextDocument((event) => {
            documentDecorationManager.onDidCloseTextDocument(event);
        }),
        workspace.onDidOpenTextDocument((event) => {
            documentDecorationManager.onDidOpenTextDocument(event);
        }),
        window.onDidChangeTextEditorSelection((event) => {
            documentDecorationManager.onDidChangeSelection(event);
        }),
    );

    documentDecorationManager.updateAllDocuments();
}

// tslint:disable-next-line:no-empty
export function deactivate() {
}
