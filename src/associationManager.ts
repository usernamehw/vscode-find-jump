import {
	TextEditorDecorationType,
	window,
	ThemeColor,
	Range,
	TextEditor,
} from 'vscode';

import { config } from './extension';

export class AssociationManager {
	public activeDecorations: TextEditorDecorationType[] = [];
	public associations: Map<string, Range> = new Map();
	public jumpChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

	public createAssociation = (letter: string, range: Range, textEditor: TextEditor): void => {
		const finalLetter = letter === letter.toUpperCase() ? `⇧${letter.toLowerCase()}` : letter;
		const type = window.createTextEditorDecorationType({
			backgroundColor: new ThemeColor('editor.wordHighlightBackground'),
			before: {
				contentText: finalLetter,
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
		});

		this.activeDecorations.push(type);
		textEditor.setDecorations(type, [range]);
		this.associations.set(letter, range);
	};

	public dispose = (): void => {
		this.activeDecorations.forEach(activeDecoration => activeDecoration.dispose());

		this.associations = new Map();
		this.activeDecorations = [];
	};
}
