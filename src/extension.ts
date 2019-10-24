'use strict';
import vscode, { commands, ExtensionContext, workspace, window, ThemeColor, OverviewRulerLane } from 'vscode';
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

		letterDecorationType = window.createTextEditorDecorationType({
			backgroundColor: new ThemeColor('editor.wordHighlightBackground'),
			before: {
				margin: '0 5px 0 5px',
				backgroundColor: config.letterBackground,
				border: `3px solid ${config.letterBackground}`,
				color: config.letterForeground,
			},
			light: {
				before: {
					backgroundColor: config.letterBackgroundLight,
					borderColor: config.letterBackgroundLight,
					color: config.letterForegroundLight,
				},
			},
			overviewRulerColor: config.overviewRulerMatchForeground,
			overviewRulerLane: OverviewRulerLane.Center,
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
