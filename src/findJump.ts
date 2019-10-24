import {
	Selection,
	TextEditor,
	TextLine,
	Range,
	commands,
	window,
	DecorationOptions,
} from 'vscode';
import { InlineInput } from './inlineInput';
import { documentRippleScanner } from './documentRippleScanner';
import { AssociationManager } from './associationManager';
import { letterDecorationType } from './extension';

// types
interface IMatch {
	start: number;
	end: number;
	excludedChars: string[];
}
type MatchesArr = IMatch[];

export class FindJump {
	isActive = false;
	inlineInput!: InlineInput;
	intervalHandler: any;
	userInput = '';
	textEditor!: TextEditor;
	associationManager = new AssociationManager();
	activityIndicatorState = 0;
	activatedWithSelection = false;
	numberOfMatches = 0;
	decorationOptions: DecorationOptions[] = [];

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

			this.decorationOptions.push(this.associationManager.createAssociation(availableJumpChar, range, this.textEditor));
		}

		this.textEditor.setDecorations(letterDecorationType, this.decorationOptions);
	};

	jump = (jumpChar: string): void => {
		const range = this.associationManager.associations.get(jumpChar);

		if (!range) {
			return;
		}

		const { line, character } = range.start;

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
		const documentIterator = documentRippleScanner(document, selection.end.line);
		const availableJumpChars = [...this.associationManager.jumpChars];
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

	getLineMatches = (line: TextLine): MatchesArr => {
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
			const excludedChars = haystack.slice(end, end + 8).replace(/[^a-z]/gi, '').split('');
			indexes.push({ start, end, excludedChars });
			iterationNumber++;
		}

		return indexes;
	};

	reset = (): void => {
		this.isActive = false;
		this.activatedWithSelection = false;
		this.userInput = '';
		this.textEditor.setDecorations(letterDecorationType, []);
		this.clearActivityIndicator();
		this.inlineInput.destroy();
		this.associationManager.dispose();

		commands.executeCommand('setContext', 'findJumpActive', false);
	};
	/**
	 * TODO: write description
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
				this.inlineInput.deleteLastCharacter();
				this.userInput = this.userInput.slice(0, -1);
				this.performSearch();
			}
		}
		this.updateStatusBarWithActivityIndicator();
	};

	updateStatusBarWithActivityIndicator = (): void => {
		const callback = (): void => {
			// ┆ ┇ ┣ ┫ ╏ ▎▐ ░ ▒ ▓
			if (this.activityIndicatorState === 1) {
				this.inlineInput.updateStatusBar(`${this.numberOfMatches} ┃ ${this.userInput} 🔴 ┃`);
				this.activityIndicatorState = 0;
			} else {
				this.inlineInput.updateStatusBar(`${this.numberOfMatches} ┃ ${this.userInput} ⚪ ┃`);
				this.activityIndicatorState = 1;
			}
		};

		this.inlineInput.updateStatusBar(
			`${this.numberOfMatches} ┃ ${this.userInput} ${this.activityIndicatorState === 0 ? '🔴' : '⚪'} ┃`
		);

		if (this.intervalHandler === undefined) {
			this.intervalHandler = setInterval(callback, 600);
		}
	};

	clearActivityIndicator = (): void => {
		clearInterval(this.intervalHandler);
		this.intervalHandler = undefined;
	};
}
