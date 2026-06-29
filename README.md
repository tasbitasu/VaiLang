# VaiLang

VaiLang is a small, custom programming language project

The project has two parts:

1. **VaiLang Studio** (`index.html` + `script.js`) — a browser-based code editor mockup with a JavaScript simulation of a more ambitious version of the language
2. **`vai`** — the actual C++ compiler/transpiler (the real backend)


> ⚠️ **Note on project status:** these two parts currently implement *different* languages. The C++ backend only supports `print` statements with integer `+`/`-`. The web demo simulates a much richer language (variables, `if`/`while`, booleans, custom keywords) but isn't actually wired up to the C++ backend. See [Roadmap](#roadmap) below.

---

## Project structure

```
VaiLang/
├── CMakeLists.txt          # Build config (project: VaiLang, binary: vai)
├── include/
│   ├── lexer.h             # Token types & Lexer class declaration
│   ├── parser.h            # Parser class declaration
│   ├── ast.h               # AST node definitions (NumberNode, BinaryOpNode, PrintNode)
│   └── codegen.h           # Code generator declaration
├── src/
│   ├── main.cpp            # Entry point — reads file, runs the pipeline
│   ├── lexer/lexer.cpp     # Source text → tokens
│   ├── parser/parser.cpp   # Tokens → AST (recursive descent)
│   └── codegen/generator.cpp # AST → generated C++ source
├── test.vai                # Sample VaiLang source file
├── index.html              # Web IDE shell ("VaiLang Studio")
├── script.js                # JS lexer/parser simulation for the web demo
├── style.css                # Web demo styling
└── .vscode/
    ├── tasks.json           # Build task for VS Code
    └── launch.json          # Debug/run config for VS Code
```

## Web demo — VaiLang Studio

`index.html` is a standalone, dark-themed code editor UI with syntax highlighting and a "RUN" button. It's a **JavaScript simulation only** — `script.js` implements its own lexer/interpreter in JS and does not call the real `vai` compiler. Open it directly in a browser, or serve it locally:

```bash
python3 -m http.server 8000
```

The simulated language in the web demo supports a richer (fictional, for now) keyword set, e.g.:

| Keyword | Meaning |
|---|---|
| `VAI START` / `VAI END` | Program begin/end |
| `DEKHAW VAI "..."` | Print a value |
| `JOGAVAI` / `MINUSVAI` / `GUNAVAI` / `VAGAVAI` / `FOGAVAI` | `+` `-` `*` `/` `%` |
| `JODI VAI` | if |
| `GHUR VAI` | while |
| `FATIVAI` | break |
| `BARAVAI` | increment |

None of these are implemented in the C++ backend yet.

## Roadmap

The biggest open task is reconciling the two halves of the project:
- [ ] Extend the C++ lexer/parser/AST to support variables, `if`/`while`, and the full VAI keyword set
- [ ] Either wire the web demo to call the real `vai` binary (e.g. via a small server, or a WASM build of the compiler), or retire the JS simulation in favor of the real backend
- [ ] Move from "transpile to C++" toward direct execution (interpreter or real codegen), if desired
- [ ] Add error handling/diagnostics with line numbers for invalid syntax

## How it works (the real C++ pipeline)

VaiLang follows a classic four-stage compiler pipeline:

```
Source (.vai) → Lexer → Tokens → Parser → AST → Code Generator → C++ source
```

1. **Lexer** (`lexer.cpp`) — scans the raw text and produces tokens like `TOKEN_PRINT`, `TOKEN_INT`, `TOKEN_PLUS`, `TOKEN_MINUS`, `TOKEN_EOF`.
2. **Parser** (`parser.cpp`) — a recursive-descent parser that turns the token stream into a small AST.
3. **AST** (`ast.h`) — node types: `NumberNode`, `BinaryOpNode`, `PrintNode`, built with `shared_ptr`.
4. **Code Generator** (`generator.cpp`) — walks the AST and emits valid C++ (an `#include <iostream>` + `main()` with `std::cout` calls), printed to stdout.

### Currently supported syntax

```
print 10 + 20 - 5
print 100 + 100
```

That's it for now — `print` followed by an integer expression using `+` and `-`.

## Building

### Option A — CMake
```bash
mkdir build && cd build
cmake ..
make
```
Produces an executable named `vai`.

### Option B — g++ directly (no CMake required)
```bash
g++ -std=c++17 -Iinclude src/main.cpp src/lexer/lexer.cpp src/parser/parser.cpp src/codegen/generator.cpp -o vai
```

### Option C — VS Code
Open the folder in VS Code and press **Ctrl+Shift+B** (uses `.vscode/tasks.json`), or **F5** to build and run against `test.vai` (uses `.vscode/launch.json`). Requires the C/C++ extension and a working `g++`/`gdb` (e.g. via MSYS2 on Windows).

## Running

```bash
./vai test.vai
```

This **prints transpiled C++ to stdout** — it does not execute your VaiLang program directly. To actually run it:

```bash
./vai test.vai > output.cpp
g++ -std=c++17 output.cpp -o output
./output
```

> **Windows/PowerShell users:** plain `>` redirection in PowerShell writes UTF-16 by default, which corrupts the generated `.cpp` file. Use one of these instead:
> ```powershell
> .\vai.exe test.vai | Set-Content -Encoding ascii output.cpp
> ```
> or
> ```powershell
> cmd /c ".\vai.exe test.vai > output.cpp"
> ```

## License
open-source this.
