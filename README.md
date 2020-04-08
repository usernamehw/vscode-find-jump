> This is a fork (kind of) of https://github.com/msafi/xvsc/tree/master/findJump. Changes between this and the original repo should be reflected in the [CHANGELOG](https://github.com/usernamehw/vscode-find-jump/blob/master/CHANGELOG.md) file.

Find-Jump works when you type a sequence of characters so that it can narrow down the location to where you want to jump.

<!-- ![](https://raw.githubusercontent.com/usernamehw/vscode-find-jump/master/img/demo.gif) -->
![](https://raw.githubusercontent.com/msafi/xvsc/master/findJump/demoFiles/demo.gif)

## How to use Find-Jump

When you activate Find-Jump (<kbd>Ctrl</kbd>+<kbd>;</kbd>), you'll see a blinking red light in the status bar indicating that Find-Jump is active and is receiving your input (see gif above). Now you can start typing the characters to where you want to jump. Usually 3 to 5 characters should be enough to narrow down the location, but your own workflow may vary.

A few things to note:

* The jump character is always a single letter. Sometimes the jump character needs to be pressed with the SHIFT key, which would be indicated on the jump location like `⇧z`
* Pressing the arrow keys or the enter key will exit Find-Jump

## Settings

<details>

<summary> Table of contributed settings:</summary>

| Name | Default | Description |
| --- | --- | --- |
| findJump.letterBackground | #4169E1 | Background color of the extension's main decoration: letter to jump. |
| findJump.letterForeground | #ffffff | Color of the extension's main decoration: letter to jump. |
| findJump.matchBackground | editor.wordHighlightBackground | |
| findJump.matchForeground | | |
| findJump.overviewRulerMatchForeground | #4169E1 | Color of the matches in the scrollbar area. |
| findJump.light | | Overwrite colors for light themes. |
| findJump.jumpChars | jfdksa;wibceghlmnopqrtuvxyzJFDKSABCEGHILMNOPQRTUVWXYZ | Use custom alphabet for jump chars. The order is important. Default value is assigned with qwerty keyboard in mind with home row keys `A S D F J K l ;` put in front. Old alphabet: `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`. |
| findJump.excludeNextChars | **3** | |
| findJump.jumpCursorPosition | start | Place where to jump cursor: before searching range or after. |
| findJump.onlyVisibleRanges | **true** | When enabled - will search only in visible text in editor. |
| findJump.dimWhenActive | **false** | When enabled - will show code as grayscale to see matches more easily. (copied from [another fork](https://marketplace.visualstudio.com/items?itemName=si3792.xray-jump)) |

</details>

> Color settings support referencing [Theme Color Id](https://code.visualstudio.com/api/references/theme-color).

## Commands

- `findJump.activate`: which activates Find-Jump
- `findJump.activateWithSelection`: like `findJump.activate` but will make a selection from the current cursor position to the new cursor position

# TODO (in the future):

- [ ] ✨ Option to search in all visible editors (split/grid)
- [ ] ✨ Command to go to the next/previous match
- [ ] 🐎 Option to render decoraitons on top of the text instead of prepending (that moves the entire text)