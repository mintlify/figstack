import { Prompt, addCommentsToLanguage } from './utility';

export const COMPLEXITY = (code: string, language: string): Prompt => {
  const commentedLanguage = addCommentsToLanguage(language);
  return {prompt: `${commentedLanguage}
${code}
###
The time complexity of this function is`,
  stop: ['###', '\n'],
  postFormat: (response) => {
    const trimmedResult = response.trim();
    const regExp = /O\(([^)]+)\)/;
    const matches = regExp.exec(trimmedResult);

    if (matches == null || matches.length < 2) {
      throw 'No complexity identified'
    }

    return matches[1];
  }
  }}