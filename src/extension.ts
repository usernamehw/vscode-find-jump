'use strict';
import vscode, { commands, ExtensionContext, workspace } from 'vscode';
import { FindJump } from './findJump';
import { subscriptions as inlineInputSubscriptions } from './inlineInput';



export interface IConfig {
	letterBackground: string;
	letterBackgroundLight: string;
	letterForeground: string;
	letterForegroundLight: string;

	overviewRulerMatchForeground: string;
}
export let config: IConfig;

export function activate(context: ExtensionContext): void {
	const EXTENSION_NAME = 'findJump';
	config = workspace.getConfiguration(EXTENSION_NAME) as any as IConfig;

	const findJump = new FindJump();

	context.subscriptions.push(
		commands.registerTextEditorCommand(
			`${EXTENSION_NAME}.activate`,
			findJump.activate
		),
		commands.registerTextEditorCommand(
			`${EXTENSION_NAME}.activateWithSelection`,
			findJump.activateWithSelection
		),
		commands.registerTextEditorCommand(
			`${EXTENSION_NAME}.cancel`,
			findJump.reset
		),
		commands.registerTextEditorCommand(
			`${EXTENSION_NAME}.backspace`,
			findJump.backspace
		)
	);

	function updateConfig(e: vscode.ConfigurationChangeEvent): void {
		if (!e.affectsConfiguration(EXTENSION_NAME)) return;

		config = workspace.getConfiguration(EXTENSION_NAME) as any as IConfig;
	}
	context.subscriptions.push(workspace.onDidChangeConfiguration(updateConfig));
}

export function deactivate(): void {
	const subscriptions = [...inlineInputSubscriptions];

	subscriptions.forEach(
		subscription => subscription.dispose()
	);
}
