/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import axios from 'axios';
import { URLSearchParams } from 'url';
import { BACKEND_ENDPOINT, getLoginURL, getLogoutURL } from './constants';
import { addComments } from './utility/comments';

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
  const figChannel = vscode.window.createOutputChannel('Figstack');
  const storageManager = new LocalStorageService(context.globalState);

  // Only use during development
  // Reference with figlog(log);
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
    if (newTokens?.refreshToken) {
      storageManager.setValue('refreshToken', newTokens.refreshToken);
    }

    if (newTokens?.accessToken) {
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
      } else if (uri.path === '/logout') {
        storageManager.setValue('accessToken', null);
        storageManager.setValue('refreshToken', null);
        vscode.commands.executeCommand('setContext', 'fig.isAuthenticated', false);
      }
    }
  });

  const getTokens = () => {
    const refreshToken = storageManager.getValue('refreshToken');
    const accessToken = storageManager.getValue('accessToken');

    return { refreshToken, accessToken };
  };

  const login = vscode.commands.registerCommand('fig.login', async () => {
    vscode.env.openExternal(vscode.Uri.parse(getLoginURL(vscode.env.uriScheme)));
  });

  const logout = vscode.commands.registerCommand('fig.logout', async () => {
    vscode.env.openExternal(vscode.Uri.parse(getLogoutURL(vscode.env.uriScheme)));
  });

  const askFunction = vscode.commands.registerCommand('fig.ask', async () => {
    const question = await vscode.window.showInputBox(
      { title: 'What would you like to ask about the selected code?', placeHolder: 'Enter you question here' }
    );

    if (!question) {return;}

    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Answering question',
      cancellable: true,
    }, () => {
      return new Promise(async (resolve, reject) => {

        const editor = vscode.window.activeTextEditor;
        if (editor?.selection) {
          const highlight = getSelectedText(editor);

          try {
            const { refreshToken, accessToken } = getTokens();
            const askResponse = await axios.post(`${BACKEND_ENDPOINT}/function/v1/ask`, {
              code: highlight,
              inputLanguage: editor.document.languageId,
              question,
              accessToken,
              refreshToken,
              source: 'vscode'
            });
            const { output, newTokens } = askResponse.data;
            potentiallyReplaceTokens(newTokens);
            vscode.window.showInformationMessage(output);
            resolve(output);
          } catch (err: any) {
            let errorMessage = 'Error - Alternatively use the Figstack web app (figstack.com).';
            if (err?.response?.data?.error) {
              errorMessage = err.response.data.error;
            }
            vscode.window.showErrorMessage(errorMessage);
            resolve(errorMessage);
          }
        }
      });
    });
  });

  const explainFunction = vscode.commands.registerCommand('fig.explain', async () => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Explaining code',
      cancellable: true,
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
              inputLanguage: editor.document.languageId,
              outputLanguage: 'English',
              accessToken,
              refreshToken,
              source: 'vscode'
            });
            const { output, newTokens } = explainResponse.data;
            potentiallyReplaceTokens(newTokens);
            // Add language here
            const commentedExplain = addComments(output, editor.document.fileName);
            const snippet = new vscode.SnippetString(`${commentedExplain}\n`);
            editor.insertSnippet(snippet, insertPosition);
            resolve('Added explination');

          } catch (err: any) {
            let errorMessage = 'Error - Alternatively use the Figstack web app (figstack.com).';
            if (err?.response?.data?.error) {
              errorMessage = err.response.data.error;
            }
            vscode.window.showErrorMessage(errorMessage);
            resolve(errorMessage);
          }
        } else {
          reject('No text selected');
        }
      });
    });
  });

  const askFileFunction = vscode.commands.registerCommand('fig.askFile', async () => {
    const question = await vscode.window.showInputBox(
      { title: 'What would you like to ask about the file?', placeHolder: 'Enter you question here' }
    );

    if (!question) {return;}

    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Answering question',
      cancellable: true,
    }, () => {
      return new Promise(async (resolve, reject) => {

        const editor = vscode.window.activeTextEditor;
        const fileText = editor?.document.getText();
        if (fileText) {
          try {
            const { refreshToken, accessToken } = getTokens();
            const askResponse = await axios.post(`${BACKEND_ENDPOINT}/function/v1/ask`, {
              code: fileText,
              inputLanguage: editor?.document.languageId,
              question,
              accessToken,
              refreshToken,
              source: 'vscode'
            });
            const { output, newTokens } = askResponse.data;
            potentiallyReplaceTokens(newTokens);
            vscode.window.showInformationMessage(output);
            resolve(output);
          } catch (err: any) {
            let errorMessage = 'Error - Alternatively use the Figstack web app (figstack.com).';
            if (err?.response?.data?.error) {
              errorMessage = err.response.data.error;
            }
            vscode.window.showErrorMessage(errorMessage);
            resolve(errorMessage);
          }
        }
      });
    });
  });

  const docstringFunction = vscode.commands.registerCommand('fig.docstring', async () => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Generating docstring',
      cancellable: true,
    }, () => {
      return new Promise(async (resolve, reject) => {
        const editor = vscode.window.activeTextEditor;
        if (editor?.selection) {
          const highlight = getSelectedText(editor);
          const insertPosition = getInsertPosition(editor);

          try {
            const { refreshToken, accessToken } = getTokens();
            const docstringResponse = await axios.post(`${BACKEND_ENDPOINT}/function/v2/docstring`, {
              code: highlight,
              inputLanguage: editor.document.languageId,
              accessToken,
              refreshToken,
              source: 'vscode'
            });
            const { output, newTokens } = docstringResponse.data;
            potentiallyReplaceTokens(newTokens);
            const docstringExplain = addComments(output, editor.document.fileName);
            const snippet = new vscode.SnippetString(`${docstringExplain}\n`);
            editor.insertSnippet(snippet, insertPosition);
            resolve('Complete docstring generation');
          } catch (err: any) {
            let errorMessage = 'Error - Alternatively use the Figstack web app (figstack.com).';
            if (err?.response?.data?.error) {
              errorMessage = err.response.data.error;
            }
            vscode.window.showErrorMessage(errorMessage);
            resolve(errorMessage);
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
      cancellable: true,
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
              inputLanguage: editor.document.languageId,
              language: languageId,
              accessToken,
              refreshToken,
              source: 'vscode'
            });
            const { output, newTokens } = complexityResponse.data;
            potentiallyReplaceTokens(newTokens);
            const commentedExplain = addComments(`Time Complexity: O(${output})`, editor.document.fileName);
            const snippet = new vscode.SnippetString(`${commentedExplain}\n`);
            editor.insertSnippet(snippet, insertPosition);
            resolve('Calculated time complexity');
          } catch (err: any) {
            let errorMessage = 'Error - Alternatively use the Figstack web app (figstack.com).';
            if (err?.response?.data?.error) {
              errorMessage = err.response.data.error;
            }
            vscode.window.showErrorMessage(errorMessage);
            resolve(errorMessage);
          }
        }
      });
    });
  });

  context.subscriptions.push(
    login, logout, explainFunction, askFunction, askFileFunction,
    complexityFunction, docstringFunction, uriListener
  );
}
