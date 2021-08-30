import * as vscode from 'vscode';
import axios from 'axios';

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
	let disposable = vscode.commands.registerCommand('fig.explain', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
		if (editor?.selection) {
			const highlightRange = new vscode.Range(editor.selection.start, editor.selection.end);
			const highlight = editor.document.getText(highlightRange);

			const explainResponse = await axios.post('http://localhost:5000/function/v1/explain', {
				code: highlight,
				accessToken: 'sTRGO9Mb8UNrKIshDRivdABokvDordlp',
			});
			const explain = explainResponse.data.output;
			const commentedExplain = explain.split('\n').map((line: string) => `// ${line}`).join('\n');

			const insertPosition = new vscode.Position(editor.selection.start.line - 1, editor.selection.start.character + MAX_LINE);
			const snippet = new vscode.SnippetString(`\n${commentedExplain}`);
			editor.insertSnippet(snippet, insertPosition);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
