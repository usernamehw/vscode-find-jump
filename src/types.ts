export interface IConfig {
	jumpChars: string;
	excludeNextChars: number;
	onlyVisibleRanges: boolean;

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

	overviewRulerMatchForeground: string;
	jumpCursorPosition: 'start' | 'end';
}
