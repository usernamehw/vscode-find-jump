import { Selection, TextEditor, TextLine, Range, commands, window, DecorationOptions, TextEditorDecorationType } from 'vscode';

import { InlineInput } from './inlineInput';
import { documentRippleScanner } from './documentRippleScanner';
import { AssociationManager } from './associationManager';
import { letterDecorationType, config } from './extension';
import { IMatch } from './types';

export class FindJump {
	isActive = false;
	inlineInput!: InlineInput;
	intervalHandler: any;
	userInput = '';
	textEditor!: TextEditor;
	associationManager = new AssociationManager();
	activityIndicatorState = false;
	activatedWithSelection = false;
	numberOfMatches = 0;
	decorationOptions: DecorationOptions[] = [];
	dim!: TextEditorDecorationType;
	bright!: TextEditorDecorationType;
	allRanges: Range[] = [];

	activate = (textEditor: TextEditor): void => {
		this.textEditor = textEditor;

		if (this.isActive) {
			this.reset();
		}

		window.showTextDocument(textEditor.document);

		this.isActive = true;

		commands.executeCommand('setContext', 'findJumpActive', true);

		this.inlineInput = new InlineInput({
			textEditor,
			onInput: this.onInput,
			onCancel: this.reset,
		});

		this.updateStatusBarWithActivityIndicator();
		this.startDim();
	};

	activateWithSelection = (textEditor: TextEditor): void => {
		this.activatedWithSelection = true;
		this.activate(textEditor);
	};

	onInput = (input: string, char: string) => {
		if (this.associationManager.associations.has(char)) {
			this.jump(char);
			return;
		}

		this.userInput = input;
		this.updateStatusBarWithActivityIndicator();

		this.performSearch();
	};

	performSearch = (): void => {
		this.decorationOptions = [];
		const { matches, availableJumpChars } = this.getMatchesAndAvailableJumpChars();

		if (matches.length > 0) {
			this.associationManager.dispose();

			// Dont gray out matches from previous iteration
			this.clearBright();
			this.allRanges = [];
		}

		this.numberOfMatches = matches.length;

		for (let i = 0; i < matches.length; i++) {
			if (availableJumpChars[i] === undefined) {
				break;
			}

			const match = matches[i];
			const availableJumpChar = availableJumpChars[i];
			const { index, value } = match;
			const range = new Range(index, value.start, index, value.end);

			this.allRanges.push(new Range(index, value.start === 0 ? 0 : value.start - 1, index, Math.max(value.start + 1, value.end)));

			this.decorationOptions.push(this.associationManager.createAssociation(availableJumpChar, range));
		}

		this.textEditor.setDecorations(letterDecorationType, this.decorationOptions);

		if (this.dim && matches.length > 0) {
			this.bright = this.bright || window.createTextEditorDecorationType({
				textDecoration: `none; filter: none !important;`,
			});
			this.textEditor.setDecorations(this.bright, this.allRanges);
		}
	};

	jump = (jumpChar: string): void => {
		this.clearDim();
		const range = this.associationManager.associations.get(jumpChar);

		if (!range) {
			return;
		}

		const cursorPosition = config.jumpCursorPosition;
		const { line, character } = range[cursorPosition];

		this.textEditor.selection = new Selection(
			this.activatedWithSelection ? this.textEditor.selection.start.line : line,
			this.activatedWithSelection ? this.textEditor.selection.start.character : character,
			line,
			character
		);

		this.reset();
	};

	getMatchesAndAvailableJumpChars = () => {
		const { document, selection } = this.textEditor;
		let firstLineIndex = 0;
		let lastLineIndex = document.lineCount - 1;

		if (config.onlyVisibleRanges) {
			const visibleRanges = this.textEditor.visibleRanges[0];
			firstLineIndex = visibleRanges.start.line !== 0 ? visibleRanges.start.line - 1 : 0;
			lastLineIndex = visibleRanges.end.line !== document.lineCount - 1 ? visibleRanges.end.line + 1 : document.lineCount - 2;
		}
		const documentIterator = documentRippleScanner(document, selection.end.line, firstLineIndex, lastLineIndex);
		const availableJumpChars = [...config.jumpChars];
		const matches: { value: IMatch; index: number }[] = [];

		outer: for (const { line, index } of documentIterator) {
			const lineMatches = this.getLineMatches(line);

			for (const lineMatch of lineMatches) {
				if (matches.length >= availableJumpChars.length) {
					break outer;
				}

				matches.push({ value: lineMatch, index });

				for (const excludedChar of lineMatch.excludedChars) {
					for (let i = 0; i < 2; i++) {
						const method = i === 0 ? 'toLowerCase' : 'toUpperCase';
						const indexOfExcludedChar = availableJumpChars.indexOf(excludedChar[method]());

						if (indexOfExcludedChar !== -1) {
							availableJumpChars.splice(indexOfExcludedChar, 1);
						}
					}
				}
			}
		}

		return { matches, availableJumpChars };
	};

	getLineMatches = (line: TextLine): IMatch[] => {
		const indexes = [];
		const { text } = line;
		const haystack = text.toLowerCase();
		const needle = this.userInput.toLowerCase();

		let index = 0;
		let iterationNumber = 0;
		while (
			(index = haystack.indexOf(needle, iterationNumber === 0 ? 0 : index + needle.length)) !== -1
		) {
			const start = index;
			const end = index + needle.length;
			const excludedChars = haystack.slice(end, end + config.excludeNextChars).replace(/[^a-z]/gi, '').split('');
			indexes.push({ start, end, excludedChars });
			iterationNumber++;
		}

		return indexes;
	};

	reset = (): void => {
		this.isActive = false;
		this.activatedWithSelection = false;
		this.numberOfMatches = 0;
		this.userInput = '';
		this.textEditor.setDecorations(letterDecorationType, []);
		this.clearActivityIndicator();
		this.inlineInput.destroy();
		this.associationManager.dispose();
		this.clearDim();

		commands.executeCommand('setContext', 'findJumpActive', false);
	};
	/**
	 * What happens when backspace key is pressed
	 *
	 * Delete last typed character
	 *
	 * If nothing to delete - exit jump mode
	 */
	backspace = (): void => {
		switch (this.userInput.length) {
			case 0: {
				this.reset();
				break;
			}
			case 1: {
				this.activate(this.textEditor);
				break;
			}
			default: {
				this.userInput = this.inlineInput.deleteLastCharacter();
				this.performSearch();
			}
		}
		this.updateStatusBarWithActivityIndicator();
	};

	updateStatusBarWithActivityIndicator = (): void => {
		const callback = (): void => {
			this.inlineInput.updateStatusBar(this.userInput, this.numberOfMatches, this.activityIndicatorState);
			this.activityIndicatorState = !this.activityIndicatorState;
		};

		this.inlineInput.updateStatusBar(this.userInput, this.numberOfMatches, this.activityIndicatorState);

		if (this.intervalHandler === undefined) {
			this.intervalHandler = setInterval(callback, 650);
		}
	};

	clearActivityIndicator = (): void => {
		clearInterval(this.intervalHandler);
		this.intervalHandler = undefined;
	};

	startDim = () => {
		if (!config.dimWhenActive) return;
		this.dim = window.createTextEditorDecorationType({
			textDecoration: `none; filter: grayscale(1);`,
		});
		this.textEditor.setDecorations(this.dim, [new Range(0, 0, this.textEditor.document.lineCount, Number.MAX_VALUE)]);
	};

	clearDim = () => {
		if (this.dim) {
			this.textEditor.setDecorations(this.dim, []);
			this.dim.dispose();
			delete this.dim;
		}
		this.clearBright();
	};

	clearBright = () => {
		if (this.bright) {
			this.textEditor.setDecorations(this.bright, []);
			this.bright.dispose();
			delete this.bright;
		}
	};
}
