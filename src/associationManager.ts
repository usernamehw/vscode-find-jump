import {
	Range,
	TextEditor,
	DecorationOptions,
} from 'vscode';

export class AssociationManager {
	public associations: Map<string, Range> = new Map();
	public jumpChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

	public createAssociation = (letter: string, range: Range, textEditor: TextEditor): DecorationOptions => {
		const finalLetter = letter === letter.toUpperCase() ? `⇧${letter.toLowerCase()}` : letter;
		const decorationOptions: DecorationOptions = {
			range,
			renderOptions: {
				before: {
					contentText: finalLetter,
				},
			},
		};

		this.associations.set(letter, range);
		return decorationOptions;
	};

	public dispose = (): void => {
		this.associations = new Map();
	};
}
