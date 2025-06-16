import { useColorMode } from '@docusaurus/theme-common';
import Editor from '@monaco-editor/react';

export default function CodeBlock({ editorRef }) {
  const { colorMode } = useColorMode();

  return (
    <Editor
      height="100%"
      defaultLanguage="csharp"
      theme={colorMode === 'dark' ? 'purple-cool-dark' : 'purple-cool-light'}
      onMount={(editor) => {
        if (editorRef) editorRef.current = editor;

        editor.updateOptions({
          bracketPairColorization: {
            enabled: true,
            independentColorPoolPerBracketType: true,
          },
        });
      }}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        scrollbar: {
        },
        lineNumbers: 'on',
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0,
        scrollBeyondLastLine: false,
        wordWrap: 'off',
        padding: { top: 10, bottom: 10 },
      }}
      defaultValue={`module HelloWorld =
  type Datum = { Owner: PubKeyHash }

  [<Validator>]
  let spend (datum: Option<Datum>) (redeemer: string) (input: TxInput) (self: ScriptContext) =
      match datum with
      | Some { Owner = owner } ->

          // Check if redeemer is the expected greeting
          let mustSayHello =
              redeemer = "Hello, World!"

          // Check if transaction is signed by the owner
          let mustBeSigned =
              self.ExtraSignatories
              |> List.contains owner

          // Both conditions must be satisfied
          mustSayHello && mustBeSigned

      | None -> false`}
    />
  );
}
