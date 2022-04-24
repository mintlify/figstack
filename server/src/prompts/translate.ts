import { Prompt, addCommentsToLanguage } from './utility';

export const TRANSLATE = (code: string, inputLanguage: string,
  outputLanguage: string): Prompt => {
  const inputLanguageCommented = addCommentsToLanguage(inputLanguage);
  const outputLanguageCommented = addCommentsToLanguage(outputLanguage);
  return {prompt: `Translate this function from ${inputLanguage} into ${outputLanguage}
${inputLanguageCommented}
${code}
    
${outputLanguageCommented}`,
  stop: ['"""', '\n\n'],
  postFormat: (response) => response.trim()}
}