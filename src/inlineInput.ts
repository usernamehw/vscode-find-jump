import { StatusBarItem, StatusBarAlignment, commands, Disposable, window, TextEditor } from 'vscode';

const cancellationChars = new Set('\n');
export const subscriptions: Disposable[] = [];

export class InlineInput {
	statusBarItem: StatusBarItem;
	input = '';

	constructor(private readonly props: {
		textEditor: TextEditor;
		onInput(input: string, char: string): any;
		onCancel(...args: any[]): any;
	}) {
		subscriptions.push(
			commands.registerCommand('type', this._onInput),
			window.onDidChangeTextEditorSelection(this._onCancel)
		);

		this.statusBarItem = window.createStatusBarItem(
			StatusBarAlignment.Right,
			1000
		);
	}

	public updateStatusBar = (text: string, numberOfMatches: number, activityIndicatorState: boolean): void => {
		const indicator = activityIndicatorState ? '⚪' : '🔴';
		// ┆ ┇ ┣ ┫ ╏ ▎▐ ░ ▒ ▓
		this.statusBarItem.text = `${numberOfMatches} ░ ${text} ░ ${indicator}`;
		this.statusBarItem.show();
	};

	public destroy = (): void => {
		this.statusBarItem.dispose();
		subscriptions.forEach(subscription => subscription.dispose());
	};

	public deleteLastCharacter = (): string => {
		this.input = this.input.slice(0, -1);
		return this.input;
	};

	private readonly _onInput = ({ text }: { text: string }) => {
		const char = text;

		this.input += char;

		if (cancellationChars.has(char)) {
			this._onCancel();
		} else {
			return this.props.onInput(this.input, char);
		}
	};

	private readonly _onCancel = (...args: any[]) => {
		this.destroy();
		return this.props.onCancel(args);
	};
}
