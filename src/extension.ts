// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const MAX_LINE = 999;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	const figChannel = vscode.window.createOutputChannel("Figstack");
	figChannel.show();

	const figlog = (log: any) => {
		figChannel.appendLine(log);
	};

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('fig.explain', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
		if (editor?.selection) {
			const highlightRange = new vscode.Range(editor.selection.start, editor.selection.end);
			const highlight = editor.document.getText(highlightRange);
			figlog(highlight);

			const insertPosition = new vscode.Position(editor.selection.start.line - 1, editor.selection.start.character + MAX_LINE);
			const snippet = new vscode.SnippetString('\nHey there');
			editor.insertSnippet(snippet, insertPosition);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
