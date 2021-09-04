/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import axios from 'axios';
import { URLSearchParams } from "url";
import { loginURL } from './constants';

// Temporary: To be removed when building authentication
const ACCESS_TOKEN = 'qePk62PIzH0La5qAIbv7MHLEFxxFQZfQ';

// Global local storage
class LocalStorageService {
	constructor(private storage: vscode.Memento) {}
	
	public getValue(key: string) {
			return this.storage.get(key, null);
	}

	public setValue(key: string, value: string | null) {
			this.storage.update(key, value);
	}
}

export function activate(context: vscode.ExtensionContext) {
	
	// Initializations
	const figChannel = vscode.window.createOutputChannel("Figstack");
	const storageManager = new LocalStorageService(context.globalState);

	// Only use during development
	// Reference with figlog(string);
	const figlog = (log: any) => {
		figChannel.show();
		figChannel.appendLine(log);
	};

	// Add custom when clause for sidebar menu
	const isAuthenticated = storageManager.getValue('accessToken') !== null;
	vscode.commands.executeCommand('setContext', 'fig.isAuthenticated', isAuthenticated);

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

	const uriListener = vscode.window.registerUriHandler({
			async handleUri(uri: vscode.Uri) {
			if (uri.path === '/callback') {
				const query = new URLSearchParams(uri.query);
				const refreshToken = query.get('refreshToken');
				const accessToken = query.get('accessToken');

				// Store tokesn into store manager
				storageManager.setValue('refreshToken', refreshToken);
				storageManager.setValue('accessToken', accessToken);

				vscode.commands.executeCommand('setContext', 'fig.isAuthenticated', true);
			}
		}
	});

	const getTokens = () => {
		const refreshToken = storageManager.getValue('refreshToken');
		const accessToken = storageManager.getValue('accessToken');

		return { refreshToken, accessToken };
	};

	const login = vscode.commands.registerCommand('fig.login', async () => {
		vscode.env.openExternal(vscode.Uri.parse(loginURL));
	});

	const logout = vscode.commands.registerCommand('fig.logout', async () => {
		storageManager.setValue('accessToken', null);
		storageManager.setValue('refreshToken', null);
		vscode.commands.executeCommand('setContext', 'fig.isAuthenticated', false);
	});

	const explainFunction = vscode.commands.registerCommand('fig.explain', async () => {
		// Extract refresh token from storage
		const { refreshToken, accessToken } = getTokens();

		const editor = vscode.window.activeTextEditor;
		if (editor?.selection) {
			const highlight = getSelectedText(editor);
			const insertPosition = getInsertPosition(editor);
			try {
				const explainResponse = await axios.post('http://localhost:5000/function/v1/explain', {
					code: highlight,
					accessToken,
					refreshToken,
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

	context.subscriptions.push(login, logout, explainFunction, docstringFunction, complexityFunction, uriListener);
}
