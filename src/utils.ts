import { ThemeColor } from 'vscode';

export function pickColorType(inputColor: string): string | ThemeColor {
	if (/[a-z]+\.[a-z]+/i.test(inputColor) ||
		['contrastActiveBorder', 'contrastBorder', 'focusBorder', 'foreground', 'descriptionForeground', 'errorForeground'].includes(inputColor)
	) {
		return new ThemeColor(inputColor);
	} else {
		return inputColor;
	}
}
