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

> Color settings support referencing [Theme Color Id](https://code.visualstudio.com/api/references/theme-color).

- `findJump.letterBackground`: Background color of the extension's main decoration: letter to jump.
- `findJump.letterForeground`: Color of the extension's main decoration: letter to jump.
- `findJump.matchBackground`:
- `findJump.matchForeground`:
- `findJump.light`:Overwrite colors for light themes.
- `findJump.overviewRulerMatchForeground`: Color of the matches in the scrollbar area.
- `findJump.jumpChars`: Use custom alphabet for jump chars.
- `findJump.excludeNextChars`: Number of next excluded characters.
- `findJump.jumpCursorPosition`: Place where to jump cursor: before searching range or after.

## Commands

- `findJump.activate`: which activates Find-Jump
- `findJump.activateWithSelection`: like `findJump.activate` but will make a selection from the current cursor position to the new cursor position

# TODO (in the future):

- [ ] 🐎 Option to limit the search in visible area (instead of scanning the entire document)
- [ ] ✨ Option to search in all visible editors (split/grid)
- [ ] ✨ Command to go to the next/previous match
- [ ] 🐎 Option to render decoraitons on top of the text instead of prepending (that moves the entire text)