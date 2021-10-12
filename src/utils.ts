import { ThemeColor } from 'vscode';
/**
 * @param inputColor Takes a theme ID (like `editor.background`) or color string (like `#ffffff`) and returns vscode.ThemeColor or unchanged color string
 */
export function pickColorType(inputColor: string): ThemeColor | string {
	if (/[a-z]+\.[a-z]+/i.test(inputColor) ||
		['contrastActiveBorder', 'contrastBorder', 'focusBorder', 'foreground', 'descriptionForeground', 'errorForeground'].includes(inputColor)
	) {
		return new ThemeColor(inputColor);
	} else {
		return inputColor;
	}
}
export function getIntRange(start: number, end: number): number[] {
	const range: number[] = [];
	for (let i = start; i < end; i++) {
		range.push(i);
	}
	return range;
}

export function first<T>(items: T[], compare: (a: T, b: T)=> number): T | undefined {
	return items.slice(1).reduce((min, item) => compare(item, min) > 0 ? min : item, items[0]);
}
