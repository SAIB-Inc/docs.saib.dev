
import Editor from '@monaco-editor/react';

export default function CodeBlock({ editorRef }) {
    return <Editor 
            height="100%" 
            defaultLanguage="csharp" 
            theme="purple-cool-light"
            onMount={(editor, monacoInstance) => {
                if (editorRef) editorRef.current = editor;

                monacoInstance.editor.defineTheme('purple-cool-light', {
                    base: 'vs',
                    inherit: true,
                    rules: [
                      { token: 'keyword', foreground: '7c3aed', fontStyle: 'bold' },     
                      { token: 'string', foreground: '0ea5e9' },                         
                      { token: 'number', foreground: 'e11d48' },                         
                      { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },  
                      { token: 'type', foreground: '4c1d95' },                         
                      { token: 'identifier', foreground: '1e293b' },                   
                      { token: 'function', foreground: '3b82f6' },                     
                      { token: 'operator', foreground: '6366f1' },             
                    ],
                    colors: {
                      'editor.background': '#ffffff',
                      'editor.foreground': '#1e293b',
                      'editorLineNumber.foreground': '#d1d5db',
                      'editorLineNumber.activeForeground': '#7c3aed',
                      'editorCursor.foreground': '#7c3aed',
                    },
                  });                  
              }}
            options={{
                minimap: { enabled: false },
                lineNumbers: 'off',
                lineDecorationsWidth: 0,     
                lineNumbersMinChars: 0,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: { top: 10, bottom: 10 }
            }}
        defaultValue=
{`public class BlockReducer(IDbContextFactory<AppDbContext> dbContextFactory) : IReducer<BlockData>
{
    public async Task RollBackwardAsync(ulong slot)
    {
        using AppDbContext dbContext = dbContextFactory.CreateDbContext();

        var blocksToRollBack = dbContext.BlockData
            .AsNoTracking()
            .Where(b => b.Slot >= slot));

        dbContext.BlockData.RemoveRange(blocksToRollBack);
        await dbContext.SaveChangesAsync();
    }

    public async Task RollForwardAsync(CBlock block)
    {
        using AppDbContext dbContext = dbContextFactory.CreateDbContext();

        var blockSlot = block.Header().HeaderBody().Slot();
        var blockCbor = block.Raw is null ? CborSerializer.Serialize(block) : block.Raw;
        var blockDataEntry = new BlockData(blockSlot, blockCbor.Value.ToArray());

        dbContext.BlockData.Add(blockDataEntry);
        await dbContext.SaveChangesAsync();
    }
}
        `}
    />;
}

