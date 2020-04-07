import { ThemeColor } from 'vscode';
/**
 * @param inputColor Takes a theme ID (like `editor.background`) or color string (like `#ffffff`) and returns vscode.ThemeColor or unchanged color string
 */
export function pickColorType(inputColor: string): string | ThemeColor {
	if (/[a-z]+\.[a-z]+/i.test(inputColor) ||
		['contrastActiveBorder', 'contrastBorder', 'focusBorder', 'foreground', 'descriptionForeground', 'errorForeground'].includes(inputColor)
	) {
		return new ThemeColor(inputColor);
	} else {
		return inputColor;
	}
}
