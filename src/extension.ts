import { commands, ConfigurationChangeEvent, ExtensionContext, TextEditorDecorationType, workspace } from 'vscode';
import { updateDecorationTypes } from './decorations';
import { FindJump } from './findJump';
import { subscriptions as inlineInputSubscriptions } from './inlineInput';
import { ExtensionConfig } from './types';

export let extensionConfig: ExtensionConfig;

export const enum Const {
	EXTENSION_NAME = 'findJump',
}

export abstract class Global {
	static letterDecorationType: TextEditorDecorationType;
}

export function activate(context: ExtensionContext) {
	extensionConfig = workspace.getConfiguration(Const.EXTENSION_NAME) as any as ExtensionConfig;
	updateDecorationTypes();
	const findJump = new FindJump();

	context.subscriptions.push(
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activate`,
			findJump.activate,
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateWithSelection`,
			findJump.activateWithSelection,
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.cancel`,
			findJump.cancel,
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.backspace`,
			findJump.backspace,
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.goToFirstMatch`,
			findJump.goToFirstMatch,
		),
	);

	function updateConfig(e: ConfigurationChangeEvent): void {
		if (!e.affectsConfiguration(Const.EXTENSION_NAME)) {
			return;
		}

		extensionConfig = workspace.getConfiguration(Const.EXTENSION_NAME) as any as ExtensionConfig;
		updateDecorationTypes();
		findJump.cancel();
	}

	context.subscriptions.push(workspace.onDidChangeConfiguration(updateConfig));
}

export function deactivate(): void {
	const subscriptions = [...inlineInputSubscriptions];

	subscriptions.forEach(
		subscription => subscription.dispose(),
	);
}
