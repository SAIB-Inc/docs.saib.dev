import Editor from '@monaco-editor/react';

export default function CodeBlock({ editorRef }) {
  return <Editor
    height="100%"
    defaultLanguage="csharp"
    theme="purple-cool-light"
    onMount={(editor, monacoInstance) => {
      if (editorRef) editorRef.current = editor;
      
      monacoInstance.editor.defineTheme('purple-cool-light', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: '#FF32C6', fontStyle: 'bold' },
          { token: 'identifier', foreground: '#C478FF' },
          { token: 'delimiter', foreground: 'FFFFFF' },
          { token: 'delimiter.square', foreground: 'FFFFFF' },
        ],
        colors: {
          'editor.background': '#1C1C1C',
          'editor.foreground': '#FFFFFF',
          'editorLineNumber.foreground': '#FFFFFF33',
          'editorLineNumber.activeForeground': '#FFFFFF99',
          'editorCursor.foreground': '#ffffff',
          'editor.lineHighlightBackground': '#00000000',
          'editor.lineHighlightBorder': '#00000000',
          'editorBracketHighlight.foreground1': '#FFFFFF',
          'editorBracketHighlight.foreground2': '#FFFFFF',
          'editorBracketHighlight.foreground3': '#FFFFFF',
          'editorBracketHighlight.foreground4': '#FFFFFF',
          'editorBracketHighlight.foreground5': '#FFFFFF',
          'editorBracketHighlight.unexpectedBracket.foreground': '#FF0000'
        },
      });
      monacoInstance.editor.setTheme('purple-cool-light');
      
      // Enable bracket pair colorization
      editor.updateOptions({
        bracketPairColorization: {
          enabled: true,
          independentColorPoolPerBracketType: true
        }
      });
      
      // Add decorations for specific terms
      const model = editor.getModel();
      if (model) {
        // Function to add decorations
        const addCustomDecorations = () => {
          const text = model.getValue();
          
          // Define the terms and their colors
          const customStyleTerms = {
            // Orange group - #FFAC60
            'AppDbContext': '#FFAC60',
            'dbContextFactory': '#FFAC60',
            'CborSerializer': '#FFAC60',
            'Serialize': '#FFAC60',
            
            // Teal group - #1AC69C
            'Header': '#1AC69C',
            'HeaderBody': '#1AC69C',
            'Slot': '#1AC69C',
            'Raw': '#1AC69C',
            'Value': '#1AC69C',
            'ToArray': '#1AC69C',
            'BlockData': '#1AC69C',
            'Add': '#1AC69C',
            'SaveChangesAsync': '#1AC69C',

            // Blue group - #3FA4FF
            'IDbContextFactory': '#FFFFFF'
          };
          
          const decorations = [];
          
          // Process each term
          Object.entries(customStyleTerms).forEach(([term, color]) => {
            // Create a regex that looks for the term but not as part of another word
            // This uses word boundaries for most terms
            const regex = new RegExp(`\\b${term}\\b`, 'g');
            let match;
            
            while ((match = regex.exec(text)) !== null) {
              const startPosition = model.getPositionAt(match.index);
              const endPosition = model.getPositionAt(match.index + term.length);
              
              // Handle special cases for terms that might be part of others
              // For example, if "Serialize" is part of "CborSerializer.Serialize"
              if (term === 'Serialize' && 
                  text.substring(Math.max(0, match.index - 15), match.index).includes('CborSerializer.')) {
                // Only style if it's part of "CborSerializer.Serialize"
              }
              
              decorations.push({
                range: new monacoInstance.Range(
                  startPosition.lineNumber,
                  startPosition.column,
                  endPosition.lineNumber,
                  endPosition.column
                ),
                options: {
                  inlineClassName: `highlight-${color.substring(1)}`,
                  hoverMessage: { value: `Term: ${term}` }
                }
              });
            }
          });
          
          // Apply decorations
          const decorationIds = editor.deltaDecorations([], decorations);
        };
        
        // Add CSS for the decoration classes
        const styleElement = document.createElement('style');
        styleElement.textContent = `
          .highlight-FFAC60 {
            color: #FFAC60 !important;
            font-weight: bold;
          }
          .highlight-1AC69C {
            color: #1AC69C !important;
            font-weight: bold;
          }
        `;
        document.head.appendChild(styleElement);
        
        // Apply decorations initially
        addCustomDecorations();
        
        // Re-apply decorations when content changes
        model.onDidChangeContent(() => {
          addCustomDecorations();
        });
      }
    }}
    options={{
      readOnly: true,
      minimap: { enabled: false },
      scrollbar: {
        vertical:"hidden",
        horizontal: "hidden",
        verticalScrollbarSize: 0,
        horizontalScrollbarSize: 0,
        handleMouseWheel:false,
    },
      lineNumbers: 'on',
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 0,
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      padding: { top: 10, bottom: 10 },
      bracketPairColorization: {
        enabled: true,
        independentColorPoolPerBracketType: true
      }
    }}
    defaultValue={`public class BlockReducer(IDbContextFactory<AppDbContext> dbContextFactory) : IReducer<BlockData>
{
  public async Task RollBackwardAsync(ulong slot)
  {
    //RollBack logic here
  }

  public async Task RollForwardAsync(CBlock block)
  {
    var blockSlot = block.Header().HeaderBody().Slot();
    var blockCbor = block.Raw is null ? CborSerializer.Serialize(block) : block.Raw;
    var blockDataEntry = new BlockData(blockSlot, blockCbor.Value.ToArray());
  }
}`}
  />;
}