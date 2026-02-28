# Drools DRL for Visual Studio Code

VS Code extension providing rich language support for **Drools Rule Language (DRL)** files, powered by the [`drools-lsp`](https://github.com/apache/incubator-kie-drools/tree/main/drools-lsp) language server.

## Features

- **Syntax Highlighting** -- full TextMate grammar for DRL keywords, rule attributes, annotations, constraint/temporal operators, strings, comments, and `$variable` bindings
- **Autocomplete** -- context-sensitive completions for DRL keywords, imported types, declared types, global variables, and snippet templates for common structures (rule, query, declare, function)
- **Diagnostics** -- real-time parse error reporting as you type
- **Go-to-Definition** -- Ctrl+click (Cmd+click on macOS) to jump to rule definitions, type declarations, global declarations, function definitions, and import statements
- **Hover Documentation** -- hover over any keyword, rule, type, global, function, or import for Markdown-formatted documentation
- **Comment Toggling** -- `Ctrl+/` toggles `//` line comments
- **Bracket Matching** -- auto-close and matching for `{}`, `[]`, `()`, `""`, `''`
- **Code Folding** -- fold `rule`/`query`/`declare`/`function` blocks

## Requirements

- **Java 17+** -- the language server runs as a Java process
- **drools-lsp shaded JAR** -- built from the [`drools-lsp`](https://github.com/apache/incubator-kie-drools/tree/main/drools-lsp) module in the Drools repository

## Setup

### 1. Build the Language Server

Clone the Drools repository and build the language server:

```bash
git clone https://github.com/apache/incubator-kie-drools.git
cd incubator-kie-drools
mvn clean package -pl drools-lsp -am -DskipTests
```

This produces `drools-lsp/target/drools-lsp-999-SNAPSHOT-shaded.jar`.

### 2. Place the JAR

Copy the fat JAR into the extension's `server/` directory:

```bash
mkdir -p server
cp /path/to/incubator-kie-drools/drools-lsp/target/drools-lsp-*-shaded.jar server/drools-lsp-shaded.jar
```

Or set the `drools.lsp.serverPath` setting to point to the JAR wherever it lives on disk.

### 3. Install and Compile the Extension

```bash
npm install
npm run compile
```

### 4. Run

Press `F5` in VS Code to launch an Extension Development Host, then open any `.drl` file.

## Extension Settings

| Setting | Type | Default | Description |
|---|---|---|---|
| `drools.lsp.serverPath` | `string` | `""` | Absolute path to the `drools-lsp` shaded JAR. If empty, the extension searches its own `server/` directory for a JAR matching `drools-lsp*shaded*.jar`. |
| `drools.lsp.javaHome` | `string` | `""` | Path to a Java 17+ installation directory. If empty, the extension uses `JAVA_HOME` or falls back to `java` on PATH. |

## File Association

The extension registers the `.drl` file extension as language ID `drl`. Files are automatically recognized when opened.

## Related Projects

- [incubator-kie-drools](https://github.com/apache/incubator-kie-drools) -- the Drools engine and `drools-lsp` language server
- [drools-lsp-intellij-plugin](https://github.com/apache/drools-lsp-intellij-plugin) -- IntelliJ IDEA plugin for DRL

## License

Licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
