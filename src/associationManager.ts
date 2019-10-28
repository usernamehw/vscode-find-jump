import {
	Range,
	TextEditor,
	DecorationOptions,
} from 'vscode';

export class AssociationManager {
	public associations: Map<string, Range> = new Map();
	public jumpChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

	public createAssociation = (char: string, range: Range): DecorationOptions => {
		const finalLetter = /[a-zA-Z]/.test(char) && char === char.toUpperCase() ? `⇧${char.toLowerCase()}` : char;
		const decorationOptions: DecorationOptions = {
			range,
			renderOptions: {
				before: {
					contentText: finalLetter,
				},
			},
		};

		this.associations.set(char, range);
		return decorationOptions;
	};

	public dispose = (): void => {
		this.associations = new Map();
	};
}
