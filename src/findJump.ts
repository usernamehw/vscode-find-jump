import { commands, DecorationOptions, Range, Selection, TextEditor, TextEditorDecorationType, window } from 'vscode';
import { AssociationManager } from './associationManager';
import { extensionConfig, Global } from './extension';
import { getMatchesAndAvailableJumpChars } from './getMatches';
import { InlineInput } from './inlineInput';
import { first } from './utils';

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
	dim?: TextEditorDecorationType;
	bright?: TextEditorDecorationType;
	allRanges: Range[] = [];

	activate = (textEditor: TextEditor): void => {
		this.textEditor = textEditor;

		if (this.isActive) {
			this.cancel();
			if (extensionConfig.activateToToggle) {
				return;
			}
		}
		window.showTextDocument(textEditor.document);

		this.isActive = true;

		commands.executeCommand('setContext', 'findJumpActive', true);

		this.inlineInput = new InlineInput({
			textEditor,
			onInput: this.onInput,
			onCancel: this.cancel,
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
		const { matches, availableJumpChars } = getMatchesAndAvailableJumpChars(this.textEditor, this.userInput.toLowerCase());

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

		this.textEditor.setDecorations(Global.letterDecorationType, this.decorationOptions);

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

		const cursorPosition = extensionConfig.jumpCursorPosition !== 'selection-end'
			? extensionConfig.jumpCursorPosition
			: this.activatedWithSelection ? 'end' : 'start';
		const { line, character } = range[cursorPosition];

		this.textEditor.selection = new Selection(
			this.activatedWithSelection ? this.textEditor.selection.start.line : line,
			this.activatedWithSelection ? this.textEditor.selection.start.character : character,
			line,
			character,
		);

		this.cancel();
	};

	/**
	 * Cancel find jump mode
	 */
	cancel = (): void => {
		this.isActive = false;
		this.activatedWithSelection = false;
		this.numberOfMatches = 0;
		this.userInput = '';
		this.textEditor.setDecorations(Global.letterDecorationType, []);
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
				this.cancel();
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

	goToFirstMatch = (): void => {
		const target = first([...this.associationManager.associations.entries()], ([, { start: a }], [, { start: b }]) => a.compareTo(b));
		if (target) {
			this.jump(target[0]);
		}
	};

	updateStatusBarWithActivityIndicator = (): void => {
		const callback = (): void => {
			this.inlineInput.updateStatusBar(this.userInput, this.numberOfMatches, this.activityIndicatorState);
			this.activityIndicatorState = !this.activityIndicatorState;
		};

		this.inlineInput.updateStatusBar(this.userInput, this.numberOfMatches, this.activityIndicatorState);

		if (this.intervalHandler === undefined) {
			this.intervalHandler = setInterval(callback, 800);
		}
	};

	clearActivityIndicator = (): void => {
		clearInterval(this.intervalHandler);
		this.intervalHandler = undefined;
	};

	startDim = () => {
		if (!extensionConfig.dimWhenActive) {
			return;
		}
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
