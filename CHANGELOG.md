## 0.6.3 `11 Sep 2022`

- 🐛 Fix letter exclusion (PR [#31](https://github.com/usernamehw/vscode-find-jump/pull/31) by [@wkordalski](https://github.com/wkordalski))

## 0.6.2 `12 Oct 2021`

- 🐛 `goToFirstMatch` selects the last match on a line that has multiple match (PR [#26](https://github.com/usernamehw/vscode-find-jump/pull/26) by [@ccjmne](https://github.com/ccjmne))

## 0.6.1 `12 Jul 2021`

- ✨ Jumping should work even if the cursor is out of editor viewport

## 0.6.0 `20 May 2021`

- ✨ Option to render decorations without shifting text `"findJump.positionAbsolute": true,`
- 💥 Change default `findJump.excludeNextChars` from **3** to **4**
- 💥 Rename `findJump.overviewRulerMatchForeground` to `findJump.scrollbarMatchForeground`

## 0.5.2 `15 Dec 2020`

- 🔨 Use extensionKind `ui` to support remote

## 0.5.1 `26 May 2020`

- ✨ Go to first match command `findJump.goToFirstMatch` [PR#22](https://github.com/usernamehw/vscode-find-jump/pull/22) by [@nilscox](https://github.com/nilscox)

## 0.5.0 `08 Apr 2020`

- 🐛 Decorations should not render in folded lines
- ✨ Add grayscale option `dimWhenActive` [PR#18](https://github.com/usernamehw/vscode-find-jump/pull/18) by [@TeNNoX](https://github.com/TeNNoX)
- 💥 Change default alphabet (custom/jump chars) to prioritize qwerty home row

## 0.4.3 `01 Mar 2020`

- 🐛 Fix exception when at the end of the document 🤦‍♂️

## 0.4.2 `26 Feb 2020`

- 🐛 Fix exception when at the top of the document

## 0.4.1 `26 Feb 2020`

- ✨🐎 Add option to limit search to visible area (instead of scanning the entire document) – `findJump.onlyVisibleRanges`

## 0.4.0 `25 Feb 2020`

- ✨ Add the ability to jump the cursor at the end of the range [PR#12](https://github.com/usernamehw/vscode-find-jump/pull/12) by [@amikitevich](https://github.com/amikitevich)

## 0.3.0 `29 Oct 2019`

- ✨ Use custom alphabet for jump chars
- ✨ Configure number of next excluded characters

## 0.2.0 `25 Oct 2019`

- ✨ Show matches in Overview Ruler (scrollbar)
- ✨ Show number of matches in the status bar
- ✨ Support passing theme color id
- ✨ Configure color of matches in editor
- 🐎 Perf: reuse decoration type. Change only decoration options (text)

## 0.1.4 `24 Oct 2019`

- ✨ Press <kbd>Backspace</kbd> to delete last typed character

## 0.1.3 `24 Oct 2019`

- 🐛 Activating should focus activeTextEditor

## 0.1.2 `24 Oct 2019`

- ✨ Press <kbd>Esc</kbd> to cancel

## 0.1.1 `24 Oct 2019`

- ✨ Add setting to change decoration colors

## 0.1.0 `22 Oct 2019`

- 💥 Forked
- ✨ Remove delay
- ✨ Assign keybinding <kbd>Ctrl</kbd>+<kbd>;</kbd> by default
- 🔨 Use webpack
