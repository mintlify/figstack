import * as vscode from 'vscode';
import axios from 'axios';

// Temporary: To be removed when building authentication
const ACCESS_TOKEN = 'qePk62PIzH0La5qAIbv7MHLEFxxFQZfQ';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	const figChannel = vscode.window.createOutputChannel("Figstack");

	// Only use during development
	const figlog = (log: any) => {
		figChannel.show();
		figChannel.appendLine(log);
	};

	const getSelectedText = (editor: vscode.TextEditor): string => {
		const highlightRange = new vscode.Range(editor.selection.start, editor.selection.end);
		const highlight = editor.document.getText(highlightRange);
		return highlight;
	};

	const getInsertPosition = (editor: vscode.TextEditor): vscode.Position => {
		const firstLine = editor.document.lineAt(editor.selection.start.line);
		const insertPosition = new vscode.Position(editor.selection.start.line, firstLine.firstNonWhitespaceCharacterIndex);
		return insertPosition;
	};

	const explainFunction = vscode.commands.registerCommand('fig.explain', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor?.selection) {
			const highlight = getSelectedText(editor);
			const insertPosition = getInsertPosition(editor);
			try {
				const explainResponse = await axios.post('http://localhost:5000/function/v1/explain', {
					code: highlight,
					accessToken: ACCESS_TOKEN,
				});
				const explain = explainResponse.data.output;
				const commentedExplain = explain.split('\n').map((line: string) => `// ${line}`).join('\n');
				const snippet = new vscode.SnippetString(`${commentedExplain}\n`);
				editor.insertSnippet(snippet, insertPosition);
			} catch (err) {
				vscode.window.showErrorMessage(err);
			}
		}
	});

	const docstringFunction = vscode.commands.registerCommand('fig.docstring', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor?.selection) {
			const highlight = getSelectedText(editor);
			const languageId = editor.document.languageId;
			const insertPosition = getInsertPosition(editor);

			const inputLanguage = {
				comment: '//',
				commentedName: `// ${languageId}`
			};

			try {
				const docstringResponse = await axios.post('http://localhost:5000/function/v1/docstring', {
					code: highlight,
					inputLanguage,
					accessToken: ACCESS_TOKEN,
				});
				const docstring = docstringResponse.data.output;
				const docstringExplain = docstring.split('\n').map((line: string) => `${line}`).join('\n');
				const snippet = new vscode.SnippetString(`${docstringExplain}\n`);
				editor.insertSnippet(snippet, insertPosition);
			} catch (err) {
				vscode.window.showErrorMessage(err);
			}
		}
	});

	const complexityFunction = vscode.commands.registerCommand('fig.complexity', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor?.selection) {
			const highlight = getSelectedText(editor);
			const languageId = editor.document.languageId;
			const insertPosition = getInsertPosition(editor);

			try {
				const complexityResponse = await axios.post('http://localhost:5000/function/v1/complexity', {
					code: highlight,
					language: languageId,
					accessToken: ACCESS_TOKEN,
				});
				const complexity = complexityResponse.data.output;
				const commentedExplain = `// Time Complexity: O(${complexity})`;
				const snippet = new vscode.SnippetString(`${commentedExplain}\n`);
				editor.insertSnippet(snippet, insertPosition);
			} catch (err) {
				vscode.window.showErrorMessage(err);
			}
		}
	});

	context.subscriptions.push(explainFunction, docstringFunction, complexityFunction);
}

// this method is called when your extension is deactivated
export function deactivate() {}
