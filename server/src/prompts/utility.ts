export type Prompt = {
  prompt: string;
  stop: string[];
  postFormat: (res: string) => string;
};

const wrapAround = (
  code: string,
  start: string,
  end: string,
  newLine?: boolean
): string => {
  if (newLine) {
    return `${start}\n${code}\n${end}`;
  }

  return `${start} ${code} ${end}`;
};

const singleLine = (code: string, comment: string): string => {
  return code
    .split('\n')
    .map((line) => `${comment} ${line}`)
    .join('\n');
};

export const addCommentsToLanguage = (language: string): string => {
  switch (language.toLowerCase()) {
  case 'html':
    return wrapAround(language, '<!--', '-->');
  case 'c':
  case 'cpp':
  case 'c++':
  case 'rust':
  case 'go':
  case 'css':
  case 'scss':
  case 'php':
  case 'kotlin':
    return wrapAround(language, '/*', '*/');
  case 'haskell':
    return wrapAround(language, '{-', '-}');
  case 'ruby':
  case 'python':
  case 'r':
  case 'perl':
    return singleLine(language, '#');
  case '.erl':
  case '.hrl':
    return singleLine(language, '%');
  case 'java':
  case 'javascript':
  case 'jsx':
  case 'typescript':
  case 'tsx':
  case 'swift':
    return singleLine(language, '//');
  default:
    return language;
  }
};
