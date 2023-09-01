//
// This file is distributed under the MIT License. See LICENSE.md for details.
//

import * as vscode from "vscode";
import { LLVMIRDefinitionProvider } from "./llvmir/definition_provider";
import { LLVMIRFoldingProvider } from "./llvmir/folding_provider";
import { LLVMReferenceProvider } from "./llvmir/reference_provider";
import { LspModelProvider } from "./llvmir/lsp_model_provider";
import { Regexp } from "./llvmir/regexp";

export function activate(context: vscode.ExtensionContext) {
    const llvmConfiguration: vscode.LanguageConfiguration = {
        comments: { lineComment: ";" },
        brackets: [
            ["{", "}"],
            ["[", "]"],
            ["{", "}"],
        ],
        wordPattern: Regexp.identifierOrLabel,
    };
    const llvmirDocumentFilter: vscode.DocumentFilter = { pattern: "**/*.ll" };
    const lsp = new LspModelProvider();

    const disposable = vscode.commands.registerCommand('extension.reverseWord', function() {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get the word within the selection
			const text = document.getText(selection);
			
			//check if the selection text is !dbg followed by numbers
			
			if(text.includes("!dbg !")){
				let message = "Debug Information processed: " + text;
				vscode.window.showInformationMessage(message);
			}

			// THINGS TO DO: test to see if this works
			
			//code on how to replace text in a document
			/* 
			editor.edit(editBuilder => {
				editBuilder.replace(selection, reversed);
			});
			 */
		}
	});


    context.subscriptions.push(
        vscode.languages.setLanguageConfiguration("llvm", llvmConfiguration),
        vscode.languages.registerDefinitionProvider(llvmirDocumentFilter, new LLVMIRDefinitionProvider(lsp)),
        vscode.languages.registerReferenceProvider(llvmirDocumentFilter, new LLVMReferenceProvider(lsp)),
        vscode.languages.registerFoldingRangeProvider(llvmirDocumentFilter, new LLVMIRFoldingProvider(lsp))
    );
}

export function deactivate() {}
