/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import * as path from "path";
import * as fs from "fs";
import { workspace, ExtensionContext, window } from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: ExtensionContext): void {
  const serverOptions = getServerOptions(context);
  if (!serverOptions) {
    return;
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "drl" }],
    synchronize: {
      fileEvents: workspace.createFileSystemWatcher("**/*.drl"),
    },
  };

  client = new LanguageClient(
    "droolsLsp",
    "Drools DRL Language Server",
    serverOptions,
    clientOptions
  );

  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

function getServerOptions(context: ExtensionContext): ServerOptions | null {
  const config = workspace.getConfiguration("drools.lsp");

  const javaHome = config.get<string>("javaHome") || process.env.JAVA_HOME || "";
  const javaCommand = javaHome ? path.join(javaHome, "bin", "java") : "java";

  const serverJar = resolveServerJar(config.get<string>("serverPath") || "", context);
  if (!serverJar) {
    window.showErrorMessage(
      "Drools DRL Language Server JAR not found. " +
        "Set 'drools.lsp.serverPath' in settings or place the JAR in the extension directory."
    );
    return null;
  }

  return {
    command: javaCommand,
    args: ["-jar", serverJar],
  };
}

function resolveServerJar(
  configuredPath: string,
  context: ExtensionContext
): string | null {
  if (configuredPath && fs.existsSync(configuredPath)) {
    return configuredPath;
  }

  const extensionDir = context.extensionPath;
  const candidates = [
    path.join(extensionDir, "server", "drools-lsp-shaded.jar"),
    path.join(extensionDir, "drools-lsp-shaded.jar"),
  ];

  // Also search for any drools-lsp*shaded*.jar in the server/ directory
  const serverDir = path.join(extensionDir, "server");
  if (fs.existsSync(serverDir)) {
    const files = fs.readdirSync(serverDir);
    for (const file of files) {
      if (file.startsWith("drools-lsp") && file.includes("shaded") && file.endsWith(".jar")) {
        candidates.unshift(path.join(serverDir, file));
      }
    }
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}
