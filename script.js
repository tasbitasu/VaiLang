// --- LINE NUMBER DYNAMIC LOGIC ---
function updateLineNumbers() {
    const editor = document.getElementById("sourceCode");
    const lineNumbersDiv = document.getElementById("lineNumberDisplay");
    
    const lines = editor.value.split('\n');
    let numbersHTML = '';
    
    for (let i = 1; i <= lines.length; i++) {
        numbersHTML += `<span>${i}</span>`;
    }
    lineNumbersDiv.innerHTML = numbersHTML;
    
    // Sync scrolling for line numbers and syntax overlay
    lineNumbersDiv.scrollTop = editor.scrollTop;
    document.getElementById("highlightedCode").scrollTop = editor.scrollTop;
}


// --- SYNTAX HIGHLIGHTING SIMULATION ---
function applySyntaxHighlighting() {
    const editor = document.getElementById("sourceCode");
    const pre = document.getElementById("highlightedCode");
    
    let code = editor.value;
    
    // 1. Highlight Single-line Comments (#)
    code = code.replace(/(\#.*)/g, '<span class="comment">$1</span>');

    // 2. Highlight String Literals ("...")
    code = code.replace(/(".*?")/g, '<span class="string">$1</span>');
    
    // 3. Highlight Core Keywords (The Big List)
    const keywords = [
        "VAI START", "VAI END", "DEKHAW VAI", "VAI SET", "JODI VAI", 
        "AREKTA VAI", "NOYTU VAI", "GHUR VAI", "BARAVAI", "KOMAVAI", 
        "VAI HAA", "VAI NAA", "FATIVAI", "BANDHO VAI"
    ];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    code = code.replace(keywordRegex, '<span class="keyword">$1</span>');
    
    // 4. Highlight Arithmetic and Logical Keywords (Operator Keywords)
    const opKeywords = [
        "JOGAVAI", "MINUSVAI", "GUNAVAI", "VAGAVAI", "FOGAVAI", // Corrected GUNAVAI
        "VAI-AND", "VAI-OR", "ULTO-VAI"
    ];
    const opKeywordRegex = new RegExp(`\\b(${opKeywords.join('|')})\\b`, 'g');
    code = code.replace(opKeywordRegex, '<span class="operator-keyword">$1</span>');

    // 5. Highlight Generic Operators and Separators (=, ;, {, }, (, ), <, >, etc.)
    code = code.replace(/([\{\}\(\);,=<>!&|])/g, '<span class="operator">$1</span>');

    // 6. Highlight Numbers
    code = code.replace(/(\b\d+\b)/g, '<span class="number">$1</span>');
    
    // 7. Highlight Identifiers (must start with v/V/vai/VA/vv_)
    code = code.replace(/\b([vV]([aA][iI]|_?)[\w\d_]*)\b/g, (match) => {
        // Ensure it's not already matched as a keyword or operator keyword
        if (!keywords.includes(match) && !opKeywords.includes(match)) {
            return `<span class="identifier">${match}</span>`;
        }
        return match; 
    });


    pre.innerHTML = code;
}


// --- LEXER SIMULATION (UPDATED FOR VAILANG) ---
function simulateLexer(sourceCode) {
    
    // The official tokenMap
    const tokenMap = {
        'VAI START': 'PROG_BEGIN', 'VAI END': 'PROG_END', 'DEKHAW VAI': 'KEYWORD_PRINT',
        'VAI SET': 'KEYWORD_VAR_DECLARE', 'JODI VAI': 'KEYWORD_IF', 'AREKTA VAI': 'KEYWORD_ELSE_IF',
        'NOYTU VAI': 'KEYWORD_ELSE', 'GHUR VAI': 'KEYWORD_WHILE', 'BARAVAI': 'KEYWORD_INC',
        'KOMAVAI': 'KEYWORD_DEC', 'VAI HAA': 'BOOLEAN_TRUE', 'VAI NAA': 'BOOLEAN_FALSE',
        'FATIVAI': 'KEYWORD_BREAK', 'BANDHO VAI': 'KEYWORD_CONTINUE',
        'JOGAVAI': 'OP_ADD', 'MINUSVAI': 'OP_SUB', 'GUNAVAI': 'OP_MUL', // Corrected
        'VAGAVAI': 'OP_DIV', 'FOGAVAI': 'OP_MOD', 
        'VAI-AND': 'OP_LOGICAL_AND', 'VAI-OR': 'OP_LOGICAL_OR', 'ULTO-VAI': 'OP_LOGICAL_NOT',
        '==': 'OP_EQ', '!=': 'OP_NEQ', '>=': 'OP_GE', '<=': 'OP_LE', '>': 'OP_GT', '<': 'OP_LT',
        '=': 'OP_ASSIGN', '{': 'SEP_LBRACE', '}': 'SEP_RBRACE', '(': 'SEP_LPAREN', ')': 'SEP_RPAREN',
        ';': 'SEP_SEMI', ',': 'SEP_COMMA'
    };
    
    const lines = sourceCode.split('\n');
    let tokens = [];

    // All possible single tokens combined into one big regex
    const allTokens = [
        'VAI START', 'VAI END', 'DEKHAW VAI', 'VAI SET', 'JODI VAI', 'AREKTA VAI',
        'NOYTU VAI', 'GHUR VAI', 'BARAVAI', 'KOMAVAI', 'VAI HAA', 'VAI NAA',
        'FATIVAI', 'BANDHO VAI', 'JOGAVAI', 'MINUSVAI', 'GUNAVAI', 'VAGAVAI', 
        'FOGAVAI', 'VAI-AND', 'VAI-OR', 'ULTO-VAI',
        '==', '!=', '>=', '<=', '>', '<', '=', '{', '}', '(', ')', ';', ','
    ].map(t => t.replace(/[.*+?^${}()|\[\]\\]/g, '\\$&')); 

    // **FIXED tokenRegex** - Prioritizes multi-char keywords/operators, then string/comment, then identifier, then number
    const tokenRegex = new RegExp(`(${allTokens.join('|')})|(\"(.*?)\")|(\#.*)|([vV]([aA][iI]|_?)[\w\d_]*)|(\\d+)`, 'g');
    
    lines.forEach((line, lineNum) => {
        let match;
        const lineContent = line.trim();
        
        tokenRegex.lastIndex = 0; // Reset for each line

        // Use a loop to find all non-overlapping matches
        while ((match = tokenRegex.exec(lineContent)) !== null) {
            const tokenValue = match[0];
            const tokenType = tokenMap[tokenValue]; 

            if (tokenType) {
                // Matched a Keyword/Operator/Separator (Group 1 match)
                tokens.push({ type: tokenType, value: tokenValue, line: lineNum + 1 });
            } else if (match[2] !== undefined) {
                // Matched a String Literal (Group 2)
                tokens.push({ type: 'LITERAL_STRING', value: tokenValue, line: lineNum + 1 });
            } else if (match[4] !== undefined) {
                // Matched a Comment (Group 4) - Do nothing (skip adding to tokens)
            } else if (match[5] !== undefined) {
                 // Matched an Identifier (Group 5)
                 // Double check to prevent overlapping with single character operators like '=' or ','
                 if (tokenMap[tokenValue] === undefined) { 
                    tokens.push({ type: 'IDENTIFIER', value: tokenValue, line: lineNum + 1 });
                 }
            } else if (match[6] !== undefined) {
                // Matched a Number (Group 7)
                tokens.push({ type: 'LITERAL_INTEGER', value: tokenValue, line: lineNum + 1 });
            }
        }
    });

    return tokens;
}

// --- RUN COMPILER LOGIC (Main Function) ---
function runCompiler() {
    const source = document.getElementById("sourceCode").value;
    const consoleBox = document.getElementById("outputConsole");
    const lexerBox = document.getElementById("lexerOutput");

    lexerBox.innerHTML = '<div class="log-entry system">Tokenizing source code...</div>';
    consoleBox.innerHTML = '<div class="log-entry system">> Starting VaiLang Execution...</div>';

    if (!source.trim()) {
        consoleBox.innerHTML += '<div class="log-entry system">> No code to run.</div>';
        lexerBox.innerHTML += '<div class="log-entry system">No tokens generated.</div>';
        return;
    }

    try {
        const tokens = simulateLexer(source);
        
        // --- Display Tokens in Lexer Panel ---
        lexerBox.innerHTML = '<div class="log-entry system">Generated Tokens:</div>';
        tokens.forEach(token => {
            lexerBox.innerHTML += `<div class="log-entry token">L${token.line}: &lt;${token.type}&gt;<span class="token-value">${token.value}</span></div>`;
        });

        // --- Basic Execution Simulation ---
        let outputLines = [];
        const operatorMap = {'JOGAVAI': '+', 'MINUSVAI': '-', 'GUNAVAI': '*', 'VAGAVAI': '/', 'FOGAVAI': '%'};
        
        source.split('\n').forEach((line, index) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('DEKHAW VAI')) {
                let content = trimmed.substring('DEKHAW VAI'.length).trim();
                
                if (content.startsWith('"') && content.endsWith('"')) {
                    outputLines.push(content.slice(1, -1)); // Print String Literal
                } else if (content.length > 0) {
                    // Simple conversion of VaiLang operators to JS operators for simulation
                    let jsContent = content;
                    for (const vaiOp in operatorMap) {
                        // Replace whole word only
                        const regex = new RegExp(`\\b${vaiOp}\\b`, 'g');
                        jsContent = jsContent.replace(regex, operatorMap[vaiOp]);
                    }
                    
                    try {
                        // Use eval for arithmetic simulation (only for numbers and basic operators)
                        const result = eval(jsContent); 
                        outputLines.push(`Result: ${result}`);
                    } catch (e) {
                        outputLines.push(`Simulated Expression: ${content}`);
                    }
                }
            }
        });

        // Show Results
        consoleBox.innerHTML += `<div class="log-entry system">> Interpretation complete.</div>`;
        if (outputLines.length > 0) {
            outputLines.forEach(res => {
                consoleBox.innerHTML += `<div class="log-entry result">➜ ${res}</div>`;
            });
        } else {
            consoleBox.innerHTML += `<div class="log-entry system">No 'DEKHAW VAI' commands found or executed.</div>`;
        }


    } catch (e) {
        consoleBox.innerHTML += `<div class="log-entry error">❌ ${e.message}</div>`;
        lexerBox.innerHTML += `<div class="log-entry error">Lexing aborted due to error.</div>`;
    }
}


// --- MODAL / DOCUMENTATION LOGIC ---
function showDocumentationModal() {
    document.getElementById('docModal').style.display = 'flex';
}

function closeDocumentationModal() {
    document.getElementById('docModal').style.display = 'none';
}

// Close modal if user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById('docModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    updateLineNumbers();
    applySyntaxHighlighting(); 
});