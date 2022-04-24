import { Prompt, addCommentsToLanguage } from './utility';

export const ASK = (code: string, question: string, language: string): Prompt => {
  const commentedLanguage = addCommentsToLanguage(language);
  return {prompt:`${commentedLanguage}
${code}
###
Question: ${question.trim()}
Answer: `,
  stop: ['###', '\n\n'],
  postFormat: (response: string) => response.trim()}
}