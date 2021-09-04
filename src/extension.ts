/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import axios from 'axios';
import { URLSearchParams } from "url";
import { BACKEND_ENDPOINT, loginURL } from './constants';

type NewTokens = {
	accessToken: string | null;
	refreshToken: string | null;
};

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

	const potentiallyReplaceTokens = (newTokens: NewTokens | null | undefined) => {
		if (newTokens?.accessToken) {
			storageManager.setValue('refreshToken', newTokens.refreshToken);
		}

		if (newTokens?.refreshToken) {
			storageManager.setValue('accessToken', newTokens.accessToken);
		}
	};

	const uriListener = vscode.window.registerUriHandler({
			async handleUri(uri: vscode.Uri) {
			if (uri.path === '/callback') {
				const query = new URLSearchParams(uri.query);

				const newTokens = {
					accessToken: query.get('accessToken'),
					refreshToken: query.get('refreshToken')
				}; 

				// Store tokesn into store manager
				potentiallyReplaceTokens(newTokens);
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
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: 'Explaining code',
			cancellable: false,
		}, () => {
			return new Promise(async (resolve, reject)=> {
				const editor = vscode.window.activeTextEditor;
				if (editor?.selection) {
					const highlight = getSelectedText(editor);
					const insertPosition = getInsertPosition(editor);
					try {
						const { refreshToken, accessToken } = getTokens();
						const explainResponse = await axios.post(`${BACKEND_ENDPOINT}/function/v1/explain`, {
							code: highlight,
							accessToken,
							refreshToken,
						});
						const { output, newTokens } = explainResponse.data;
						potentiallyReplaceTokens(newTokens);
						const commentedExplain = output.split('\n').map((line: string) => `// ${line}`).join('\n');
						const snippet = new vscode.SnippetString(`${commentedExplain}\n`);
						editor.insertSnippet(snippet, insertPosition);
						resolve('Added explination');

					} catch (err: any) {
						vscode.window.showErrorMessage(err.response.data.error);
						reject(err.response.data.error);
					}
				} else {
					reject('No text selected');
				}
			});
		});
	});

	const docstringFunction = vscode.commands.registerCommand('fig.docstring', async () => {
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: 'Generating docstring',
			cancellable: false,
		}, () => {
			return new Promise(async (resolve, reject)=> {
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
						const { refreshToken, accessToken } = getTokens();
						const docstringResponse = await axios.post(`${BACKEND_ENDPOINT}/function/v1/docstring`, {
							code: highlight,
							inputLanguage,
							accessToken,
							refreshToken
						});
						const { output, newTokens } = docstringResponse.data;
						potentiallyReplaceTokens(newTokens);
						const docstringExplain = output.split('\n').map((line: string) => `# ${line}`).join('\n');
						const snippet = new vscode.SnippetString(`${docstringExplain}\n`);
						editor.insertSnippet(snippet, insertPosition);
						resolve('Complete docstring generation');
					} catch (err: any) {
						vscode.window.showErrorMessage(err.response.data.error);
						reject(err.response.data.error);
					}
				} else {
					reject('No text selected');
				}
		});
	});
	});

	const complexityFunction = vscode.commands.registerCommand('fig.complexity', async () => {
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: 'Calculating time complexity',
			cancellable: false,
		}, () => {
			return new Promise(async (resolve, reject)=> {
				const editor = vscode.window.activeTextEditor;
				if (editor?.selection) {
					const highlight = getSelectedText(editor);
					const languageId = editor.document.languageId;
					const insertPosition = getInsertPosition(editor);

					try {
						const { refreshToken, accessToken } = getTokens();
						const complexityResponse = await axios.post(`${BACKEND_ENDPOINT}/function/v1/complexity`, {
							code: highlight,
							language: languageId,
							accessToken,
							refreshToken
						});
						const { output, newTokens } = complexityResponse.data;
						potentiallyReplaceTokens(newTokens);
						const commentedExplain = `// Time Complexity: O(${output})`;
						const snippet = new vscode.SnippetString(`${commentedExplain}\n`);
						editor.insertSnippet(snippet, insertPosition);
						resolve('Calculated time complexity');
					} catch (err: any) {
						vscode.window.showErrorMessage(err.response.data.error);
						resolve(err.response.data.error);
					}
				}
		});
	});
	});

	context.subscriptions.push(login, logout, explainFunction, docstringFunction, complexityFunction, uriListener);
}
