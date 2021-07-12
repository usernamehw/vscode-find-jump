import { ThemableDecorationAttachmentRenderOptions, window } from 'vscode';
import { extensionConfig, Global } from './extension';
import { pickColorType } from './utils';

export function updateDecorationTypes() {
	if (Global.letterDecorationType) {
		Global.letterDecorationType.dispose();
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

	Global.letterDecorationType = window.createTextEditorDecorationType({
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
