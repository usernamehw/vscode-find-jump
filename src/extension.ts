import vscode, { commands, ExtensionContext, workspace, window } from 'vscode';

import { FindJump } from './findJump';
import { subscriptions as inlineInputSubscriptions } from './inlineInput';
import { pickColorType } from './utils';

export interface IConfig {
	letterBackground: string;
	letterBackgroundLight: string;
	letterForeground: string;
	letterForegroundLight: string;

	matchBackground: string;
	matchBackgroundLight: string;
	matchForeground: string;
	matchForegroundLight: string;

	overviewRulerMatchForeground: string;
}
export let config: IConfig;
export let letterDecorationType: vscode.TextEditorDecorationType;

export function activate(context: ExtensionContext): void {
	const EXTENSION_NAME = 'findJump';
	config = workspace.getConfiguration(EXTENSION_NAME) as any as IConfig;
	updateLetterDecorationType();
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
		updateLetterDecorationType();
	}
	function updateLetterDecorationType() {
		if (letterDecorationType) {
			letterDecorationType.dispose();
		}

		const letterBackground = pickColorType(config.letterBackground);

		letterDecorationType = window.createTextEditorDecorationType({
			backgroundColor: pickColorType(config.matchBackground),
			color: pickColorType(config.matchForeground),
			before: {
				margin: '0 5px 0 5px',
				backgroundColor: letterBackground,
				border: `3px solid`,
				borderColor: letterBackground,
				color: pickColorType(config.letterForeground),
			},
			light: {
				backgroundColor: pickColorType(config.matchBackgroundLight),
				color: pickColorType(config.matchForegroundLight),
				before: {
					backgroundColor: pickColorType(config.letterBackgroundLight),
					borderColor: pickColorType(config.letterBackgroundLight),
					color: pickColorType(config.letterForegroundLight),
				},
			},
			overviewRulerColor: pickColorType(config.overviewRulerMatchForeground),
			overviewRulerLane: 2, // vscode.OverviewRulerLane.Center
		});
	}
	context.subscriptions.push(workspace.onDidChangeConfiguration(updateConfig));
}

export function deactivate(): void {
	const subscriptions = [...inlineInputSubscriptions];

	subscriptions.forEach(
		subscription => subscription.dispose()
	);
}
