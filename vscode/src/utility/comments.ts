const wrapAround = (code: string, start: string, end: string, newLine?: boolean): string => {
  if (newLine) {
    return `${start}\n${code}\n${end}`;
  }

  return `${start} ${code} ${end}`;
};

const singleLine = (code: string, comment: string): string => {
  return code.split('\n').map((line) => `${comment} ${line}`).join('\n');
};

export const addComments = (code: string, filename: string): string => {
  const splitFilename = filename.toLowerCase().split('.');
  const extension = splitFilename[splitFilename.length - 1];

  if (!extension) {
    return code;
  }

  switch (`.${extension}`) {
  case '.html':
    return wrapAround(code, '<!--', '-->');
  case '.c':
  case '.cpp':
  case '.rs':
  case '.rlib':
  case '.js':
  case '.jsx':
  case '.ts':
  case '.tsx':
  case '.go':
  case '.css':
  case '.scss':
  case '.php':
  case '.kt':
  case '.kts':
  case '.ktm':
    return wrapAround(code, '/*', '*/', true);
  case '.hs':
    return wrapAround(code, '{-', '-}');
  case '.rb':
  case '.py':
  case '.r':
  case '.plx':
  case '.pl':
  case '.pm':
    return singleLine(code, '#');
  case '.erl':
  case '.hrl':
    return singleLine(code, '%');
  case '.java':
    return singleLine(code, '//');
  default:
    return code;
  }
};
