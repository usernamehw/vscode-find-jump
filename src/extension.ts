import { commands, ConfigurationChangeEvent, ExtensionContext, TextEditorDecorationType, ThemableDecorationAttachmentRenderOptions, window, workspace } from 'vscode';
import { FindJump } from './findJump';
import { subscriptions as inlineInputSubscriptions } from './inlineInput';
import { ExtensionConfig } from './types';
import { pickColorType } from './utils';

export let extensionConfig: ExtensionConfig;
export let letterDecorationType: TextEditorDecorationType;
export const EXTENSION_NAME = 'findJump';

export function activate(context: ExtensionContext) {
	extensionConfig = workspace.getConfiguration(EXTENSION_NAME) as any as ExtensionConfig;
	updateDecorationTypes();
	const findJump = new FindJump();

	context.subscriptions.push(
		commands.registerTextEditorCommand(
			`${EXTENSION_NAME}.activate`,
			findJump.activate,
		),
		commands.registerTextEditorCommand(
			`${EXTENSION_NAME}.activateWithSelection`,
			findJump.activateWithSelection,
		),
		commands.registerTextEditorCommand(
			`${EXTENSION_NAME}.cancel`,
			findJump.cancel,
		),
		commands.registerTextEditorCommand(
			`${EXTENSION_NAME}.backspace`,
			findJump.backspace,
		),
		commands.registerTextEditorCommand(
			`${EXTENSION_NAME}.goToFirstMatch`,
			findJump.goToFirstMatch,
		),
	);

	function updateConfig(e: ConfigurationChangeEvent): void {
		if (!e.affectsConfiguration(EXTENSION_NAME)) {
			return;
		}

		extensionConfig = workspace.getConfiguration(EXTENSION_NAME) as any as ExtensionConfig;
		updateDecorationTypes();
		findJump.cancel();
	}
	function updateDecorationTypes() {
		if (letterDecorationType) {
			letterDecorationType.dispose();
		}

		const letterBackground = pickColorType(extensionConfig.letterBackground);
		const letterBackgroundLight = pickColorType(extensionConfig.light.letterBackground);

		let beforeDecoration: ThemableDecorationAttachmentRenderOptions;
		if (extensionConfig.positionAbsolute) {
			beforeDecoration = {
				backgroundColor: letterBackground,
				border: `1px solid`,
				borderColor: letterBackground,
				color: pickColorType(extensionConfig.letterForeground),
				textDecoration: 'none;position:absolute;z-index:999999;max-height:100%;',
			};
		} else {
			beforeDecoration = {
				margin: '0 5px 0 5px',
				backgroundColor: letterBackground,
				border: `3px solid`,
				borderColor: letterBackground,
				color: pickColorType(extensionConfig.letterForeground),
			};
		}

		letterDecorationType = window.createTextEditorDecorationType({
			backgroundColor: pickColorType(extensionConfig.matchBackground),
			color: pickColorType(extensionConfig.matchForeground),
			before: beforeDecoration,
			light: {
				backgroundColor: pickColorType(extensionConfig.light.matchBackground),
				color: pickColorType(extensionConfig.light.matchForeground),
				before: {
					backgroundColor: letterBackgroundLight,
					borderColor: letterBackgroundLight,
					color: pickColorType(extensionConfig.light.letterForeground),
				},
			},
			overviewRulerColor: pickColorType(extensionConfig.scrollbarMatchForeground),
			overviewRulerLane: 2, // vscode.OverviewRulerLane.Center
		});
	}
	context.subscriptions.push(workspace.onDidChangeConfiguration(updateConfig));
}

export function deactivate(): void {
	const subscriptions = [...inlineInputSubscriptions];

	subscriptions.forEach(
		subscription => subscription.dispose(),
	);
}
