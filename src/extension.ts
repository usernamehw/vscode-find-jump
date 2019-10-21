'use strict';
import { commands, ExtensionContext } from 'vscode';
import { FindJump } from './findJump';
import { subscriptions as inlineInputSubscriptions } from './inlineInput';

const findJump = new FindJump();

export function activate(context: ExtensionContext): void {
	context.subscriptions.push(
		commands.registerTextEditorCommand(
			'findJump.activate',
			findJump.activate
		),
		commands.registerTextEditorCommand(
			'findJump.activateWithSelection',
			findJump.activateWithSelection
		)
	);
}

export function deactivate(): void {
	const subscriptions = [...inlineInputSubscriptions];

	subscriptions.forEach(
		subscription => subscription.dispose()
	);
}
