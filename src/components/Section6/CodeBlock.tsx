import { useEffect } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import Editor from '@monaco-editor/react';
import { useTheme } from '@mui/material';

export default function CodeBlock({ editorRef }) {
  const muiTheme = useTheme();
  const { colorMode } = useColorMode();

  let currentEditor = null;
  let currentMonaco = null;

  const defineThemes = (monacoInstance) => {
    monacoInstance.editor.defineTheme('purple-cool-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '#FF32C6', fontStyle: 'bold' },
        { token: 'identifier', foreground: '#C478FF' },
        { token: 'delimiter', foreground: 'FFFFFF' },
        { token: 'delimiter.square', foreground: 'FFFFFF' },
        { token: 'comment', foreground: 'FFFFFF' },
      ],
      colors: {
        'editor.background': '#1C1C1C',
        'editor.foreground': '#FFFFFF',
        'editorLineNumber.foreground': '#FFFFFF33',
        'editorLineNumber.activeForeground': '#FFFFFF99',
        'editorCursor.foreground': '#ffffff',
        'editor.lineHighlightBackground': '#00000000',
        'editor.lineHighlightBorder': '#00000000',
        'editorBracketHighlight.foreground1': '#ffffff',
        'editorBracketHighlight.foreground2': '#ffffff',
        'editorBracketHighlight.foreground3': '#ffffff',
        'editorBracketHighlight.unexpectedBracket.foreground': '#FF0000',
      },
    });

    monacoInstance.editor.defineTheme('purple-cool-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '#D1009C', fontStyle: 'bold' },
        { token: 'identifier', foreground: '#7D33D1' },
        { token: 'delimiter', foreground: '000000' },
        { token: 'delimiter.square', foreground: '000000' },
        { token: 'comment', foreground: '717171' },
      ],
      colors: {
        'editor.background': '#F7F9FB',
        'editor.foreground': '#000000',
        'editorLineNumber.foreground': '#00000033',
        'editorLineNumber.activeForeground': '#00000099',
        'editorCursor.foreground': '#000000',
        'editor.lineHighlightBackground': '#00000011',
        'editor.lineHighlightBorder': '#00000000',
        'editorBracketHighlight.foreground1': '#000000',
        'editorBracketHighlight.foreground2': '#000000',
        'editorBracketHighlight.foreground3': '#000000',
        'editorBracketHighlight.unexpectedBracket.foreground': '#FF0000',
      },
    });
  };

  // Switch Monaco theme based on color mode
  useEffect(() => {
    if (currentMonaco) {
      currentMonaco.editor.setTheme(
        colorMode === 'dark' ? 'purple-cool-dark' : 'purple-cool-light'
      );
    }
  }, [colorMode]);

  return (
    <Editor
      height="100%"
      defaultLanguage="csharp"
      theme={colorMode === 'dark' ? 'purple-cool-dark' : 'purple-cool-light'}
      onMount={(editor, monacoInstance) => {
        if (editorRef) editorRef.current = editor;
        currentEditor = editor;
        currentMonaco = monacoInstance;

        defineThemes(monacoInstance);
        monacoInstance.editor.setTheme(
          colorMode === 'dark' ? 'purple-cool-dark' : 'purple-cool-light'
        );

        editor.updateOptions({
          bracketPairColorization: {
            enabled: true,
            independentColorPoolPerBracketType: true,
          },
        });

        const model = editor.getModel();
        if (model) {
          const addCustomDecorations = () => {
            const text = model.getValue();
            const customStyleTerms = {
              'AppDbContext': '#C478FF',
              'dbContextFactory': '#3FA4FF',
              'blockSlot': '#3FA4FF',
              'blockCbor': '#3FA4FF',
              'block': '#3FA4FF',
              'slot': '#3FA4FF',
              'blockDataEntry': '#3FA4FF',
              'RollForwardAsync': '#FFAC60',
              'RollBackwardAsync': '#FFAC60',
              'CborSerializer': '#FFAC60',
              'Serialize': '#1AC69C',
              'Header': '#1AC69C',
              'HeaderBody': '#1AC69C',
              'Slot': '#1AC69C',
              'Raw': '#1AC69C',
              'Value': '#C478FF',
              'ToArray': '#1AC69C',
              'BlockData': '#C478FF',
              'Add': '#1AC69C',
              'SaveChangesAsync': '#1AC69C',
              'IDbContextFactory': '#FFFFFF',
            };

            const decorations = [];
            Object.entries(customStyleTerms).forEach(([term, color]) => {
              const regex = new RegExp(`\\b${term}\\b`, 'g');
              let match;
              while ((match = regex.exec(text)) !== null) {
                const startPosition = model.getPositionAt(match.index);
                const endPosition = model.getPositionAt(match.index + term.length);
                decorations.push({
                  range: new monacoInstance.Range(
                    startPosition.lineNumber,
                    startPosition.column,
                    endPosition.lineNumber,
                    endPosition.column
                  ),
                  options: {
                    inlineClassName: `highlight-${color.substring(1)}`,
                    hoverMessage: { value: `Term: ${term}` },
                  },
                });
              }
            });

            editor.deltaDecorations([], decorations);
          };

          const styleElement = document.createElement('style');
          styleElement.textContent = `
            .highlight-FFAC60 { color: #FFAC60 !important; font-weight: bold; }
            .highlight-3FA4FF { color: #3FA4FF !important; font-weight: bold; }
            .highlight-1AC69C { color: #1AC69C !important; font-weight: bold; }
          `;
          document.head.appendChild(styleElement);

          addCustomDecorations();
          model.onDidChangeContent(() => addCustomDecorations());
        }
      }}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        scrollbar: {
          vertical: 'hidden',
          horizontal: 'hidden',
          verticalScrollbarSize: 0,
          horizontalScrollbarSize: 0,
          handleMouseWheel: false,
        },
        lineNumbers: 'on',
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        padding: { top: 10, bottom: 10 },
      }}
      defaultValue={`public class BlockReducer(IDbContextFactory<AppDbContext> dbContextFactory) : IReducer<BlockData>
{
    private readonly string _validatorScriptHash = configuration.GetValue("ValidatorScriptHash", "fda46e81fdd2e4f1c358d27e7484b9f0860b63b0e8e12e6ab5f87e8c");

    public async Task RollBackwardAsync(ulong slot)
    {
        IQueryable<BlockData> blockDataQuery = dbContext.BlockData
            .Where(data => data.Slot >= slot);

        dbContext.BlockData.RemoveRange(blockDataQuery);
        await dbContext.SaveChangesAsync();
    }

    public async Task RollForwardAsync(Block block)
    {
        List<TransactionOutput> outputs = block.TransactionOutputs();

        outputs.ForEach(output =>
        {
            Address outputAddress = output.Address();
            if (outputAddress.ScriptHash() != _validatorScriptHash) return;
            dbContext.OutputData.Add(output);
        });

        await dbContext.SaveChangesAsync();
    }
}`}
    />
  );
}
