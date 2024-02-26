export interface ExtensionConfig {
	jumpChars: string;
	excludeNextChars: number;
	onlyVisibleRanges: boolean;
	positionAbsolute: boolean;
	dimWhenActive: boolean;
	activateToToggle: boolean;
	jumpCursorPosition: 'end' | 'start' | 'selection-end';

	letterBackground: string;
	letterForeground: string;
	matchBackground: string;
	matchForeground: string;

	light: {
		letterBackground: string;
		letterForeground: string;
		matchBackground: string;
		matchForeground: string;
	};

	scrollbarMatchForeground: string;
}

export interface IMatch {
	start: number;
	end: number;
	excludedChars: string[];
}

export const enum NextLineToRead {
	Current,
	Higher,
	Lower,
}
