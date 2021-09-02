/* eslint-disable @typescript-eslint/naming-convention */
import * as dotenv from 'dotenv';
import * as vscode from 'vscode';
import axios from 'axios';

// Temporary: To be removed when building authentication
const ACCESS_TOKEN = 'qePk62PIzH0La5qAIbv7MHLEFxxFQZfQ';

dotenv.config();
const IS_DEV = process.env.NODE_ENV === 'development';

class LocalStorageService {
	constructor(private storage: vscode.Memento) { }   
	
	public getValue(key: string) {
			return this.storage.get(key, null);
	}

	public setValue(key: string, value: string) {
			this.storage.update(key, value);
	}
}

export function activate(context: vscode.ExtensionContext) {
	
	// Initializations
	const figChannel = vscode.window.createOutputChannel("Figstack");
	const storageManager = new LocalStorageService(context.globalState);

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

	const login = vscode.commands.registerCommand('fig.login', async () => {
		const auth0Domain = IS_DEV ? 'https://dev-uxa1yxhj.us.auth0.com' : 'https://figstack.us.auth0.com';
		const responseType = 'code';
		const clientId = IS_DEV ? 'nv8BC1pmSBIw2HMNRqsd8Bkl5xwc1ipN' : 'zyVI6tCd7UQ44NCkqlx3TsulhrLtMYzm';
		const redirectUri = `${IS_DEV ? 'http://localhost:3000' : 'https://figstack.com'}/api/auth/vscode`;
		const scope = 'offline_access';
		const loginURL = `${auth0Domain}/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
		vscode.env.openExternal(vscode.Uri.parse(loginURL));
	});

	const uriListener = vscode.window.registerUriHandler({
			async handleUri(uri: vscode.Uri) {
			if (uri.path === '/callback') {
				const refreshToken = uri.query.split('=')[1];

				// Store refresh token into store manager
				storageManager.setValue('refreshToken', refreshToken);
			}
		}
	});

	const explainFunction = vscode.commands.registerCommand('fig.explain', async () => {
		const refreshToken = storageManager.getValue('refreshToken');
		figlog(refreshToken);
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

	context.subscriptions.push(login, explainFunction, docstringFunction, complexityFunction, uriListener);
}

// this method is called when your extension is deactivated
export function deactivate() {}
