import { Prompt, addCommentsToLanguage } from './utility';

// Original for v1 up until October 16
export const EXPLAIN_ORIGINAL = (code: string, language: string): Prompt => {
  const commentedLanguage = addCommentsToLanguage(language);
  return {prompt: `${commentedLanguage}
${code}
###
Here’s what the above code is doing:
1. `,
  stop: ['###', '\n\n'],
  postFormat: (result: string): string => {
    const listedResults = `1. ${result}`.trim();
    const splitResults = listedResults.split('\n');
    const cleanedResults = splitResults.map((result) => {
      return result.replace(/[0-9]{1,3}./, '').trim();
    });

    const resultsMap = new Map();
    const concatResults: string[] = [];
    let hasSeenDuplicate = false;
    cleanedResults.forEach((result) => {
      if (!hasSeenDuplicate && !resultsMap.get(result)) {
        resultsMap.set(result, true);
        concatResults.push(result);
      } else if (!hasSeenDuplicate && resultsMap.get(result)) {
        hasSeenDuplicate = true;
      }
    })

    const finalResults = concatResults.map((result, i) => {
      return `${i + 1}. ${result}`;
    }).join('\n');

    return finalResults;
  }}
}

// Used for V2
export const EXPLAIN_WITH_LANGUAGE = (
  code: string,
  language: string
): Prompt => {
  const commentedLanguage = addCommentsToLanguage(language);
  return {
    prompt: `${commentedLanguage}
${code}

###
Here’s what the above ${language} code is doing:
1. `,
    stop: ['###', '\n\n'],
    postFormat: (res) => `1. ${res.trim()}`,
  };
};

export const EXPLAIN_SIMPLE = (
  code: string,
  language: string
): Prompt => {
  const commentedLanguage = addCommentsToLanguage(language);
  return {
    prompt: `${commentedLanguage}
${code}
###
Question: What does the above code do?
Answer: `,
    stop: ['###', '\n'],
    postFormat: (res) => res.trim(),
  };
};