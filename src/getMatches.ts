import { Selection, TextEditor, TextLine, Range, commands, window, DecorationOptions, TextEditorDecorationType } from 'vscode';
import { config } from './extension';
import { NextLineToRead, IMatch } from './types';

/**
 * This is NOT a generator function that scans a document using a pattern similar to a water ripple. I
 * mean, we start from the line where the cursor is (as if that was the center of the ripple). Then
 * we move to the line above, then the line below. Then the second line above, then the second line
 * below and so on...
 */
export function getMatchesAndAvailableJumpChars(editor: TextEditor, needle: string) {
	const { document, selection, visibleRanges } = editor;
	let firstLineIndex = 0;
	let lastLineIndex = document.lineCount - 1;
	// const skipLines = [];// folded code
	if (config.onlyVisibleRanges) {
		const range = visibleRanges[0];
		firstLineIndex = range.start.line !== 0 ? range.start.line - 1 : 0;
		lastLineIndex = range.end.line !== document.lineCount - 1 ? range.end.line + 1 : document.lineCount - 2;

		// if (visibleRanges.length > 1) {
		// 	let lastEndLine = visibleRanges[0].end.line;
		// 	for (let i = 1; i < visibleRanges.length; i++) {
		// 		const range = visibleRanges[i];
		// 		const startLine = range.start.line;
		// 		skipLines.push(...getIntRange(lastEndLine, startLine));
		// 		lastEndLine = range.end.line;
		// 	}
		// }
	}
	// const documentIterator = documentRippleScanner(document, selection.end.line, firstLineIndex, lastLineIndex, skipLines);
	const availableJumpChars = [...config.jumpChars];
	const matches: { value: IMatch; index: number }[] = [];
	// ────────────────────────────────────────────────────────────────────────────────
	const startingLine = selection.end.line;
	let nextLineToRead: NextLineToRead = NextLineToRead.Current;
	let upLinePointer = startingLine - 1;
	let downLinePointer = startingLine + 1;
	outer: for (let line, index = 0; upLinePointer >= firstLineIndex || downLinePointer <= lastLineIndex;) {
		if (nextLineToRead === NextLineToRead.Current) {
			line = document.lineAt(startingLine);
			index = startingLine;

			if (upLinePointer >= firstLineIndex) {
				nextLineToRead = NextLineToRead.Higher;
			} else if (downLinePointer <= lastLineIndex) {
				nextLineToRead = NextLineToRead.Lower;
			} else {
				break;
			}
		} else if (nextLineToRead === NextLineToRead.Higher) {
			line = document.lineAt(upLinePointer);
			index = upLinePointer;

			upLinePointer--;

			if (downLinePointer <= lastLineIndex) {
				nextLineToRead = NextLineToRead.Lower;
			}
		} else if (nextLineToRead === NextLineToRead.Lower) {
			line = document.lineAt(downLinePointer);
			index = downLinePointer;

			downLinePointer++;

			if (upLinePointer >= firstLineIndex) {
				nextLineToRead = NextLineToRead.Higher;
			}
		}

		// @ts-ignore
		const lineMatches = getLineMatches(line, needle);
		console.log(lineMatches);
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
}

function getLineMatches(line: TextLine, needle: string): IMatch[] {
	const indexes = [];
	const { text } = line;
	const haystack = text.toLowerCase();

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
}