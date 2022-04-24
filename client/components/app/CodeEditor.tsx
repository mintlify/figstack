/* eslint-disable react/jsx-props-no-spreading */
import Editor from 'react-simple-code-editor';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/nightOwl';

type CodeEditorProps = {
  code: string;
  // eslint-disable-next-line no-unused-vars
  setCode: (code: string) => void;
  placeholder: string;
  language: string;
  disabled?: boolean;
}

export default function CodeEditor({
  code, setCode, placeholder, language, disabled,
}: CodeEditorProps) {
  const highlight = (codeUnhighlighted: string) => (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={codeUnhighlighted}
      language={language.toLowerCase() as Language}
    >
      {({
        tokens, getLineProps, getTokenProps,
      }) => (
        <>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => <span {...getTokenProps({ token, key })} />)}
            </div>
          ))}
        </>
      )}
    </Highlight>
  );

  return (
    <Editor
      value={code}
      onValueChange={(codeUpdated) => setCode(codeUpdated)}
      disabled={disabled}
      highlight={highlight}
      padding={16}
      placeholder={placeholder}
      className="border border-gray-500 rounded-lg text-sm"
      style={{
        boxSizing: 'border-box',
        fontFamily: '"Dank Mono", "Fira Code", monospace',
        minHeight: '12rem',
        ...theme.plain as any,
      }}
    />
  );
}
