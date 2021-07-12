> This is a fork (kind of) of https://github.com/msafi/xvsc/tree/master/findJump. Changes between this and the original repo should be reflected in the [CHANGELOG](https://github.com/usernamehw/vscode-find-jump/blob/master/CHANGELOG.md) file.

Find-Jump works when you type a sequence of characters so that it can narrow down the location to where you want to jump.

![Demo gif](https://raw.githubusercontent.com/msafi/xvsc/master/findJump/demoFiles/demo.gif)

## How to use Find-Jump

When you activate Find-Jump (<kbd>Ctrl</kbd>+<kbd>;</kbd>), you'll see a blinking red light in the status bar indicating that Find-Jump is active and is receiving your input (see gif above). Now you can start typing the characters to where you want to jump. Usually 3 to 5 characters should be enough to narrow down the location, but your own workflow may vary.

A few things to note:

* The jump character is always a single letter. Sometimes the jump character needs to be pressed with the SHIFT key, which would be indicated on the jump location like `⇧z`
* Pressing the arrow keys or the enter key will exit Find-Jump

<!-- COMMANDS_START -->
## Commands (3)

|Command|Description|
|-|-|
|findJump.activate|Find => Jump: Activate|
|findJump.activateWithSelection|Find => Jump: Activate in selection mode|
|findJump.goToFirstMatch|Find => Jump: Jump to first match|
<!-- COMMANDS_END -->

<!-- SETTINGS_START -->
## Settings (13)

|Setting|Default|Description|
|-|-|-|
|findJump.jumpChars|"jfdksa;..."|Use custom alphabet for jump chars. The order is important. Default value is assigned with qwerty keyboard in mind (Particularly, home row keys `A S D F J K l ;` put up front).|
|findJump.excludeNextChars|**4**|Letters are used to type text where to go but also as symbols for quick jump. This setting controls how many next character of the current match will be excluded from being used as a symbol for a jump.|
|findJump.positionAbsolute|**false**|When enabled - position decorations on top of the editor text (without shifting text).|
|findJump.onlyVisibleRanges|**true**|When enabled - will search only in visible text in editor.|
|findJump.dimWhenActive|**false**|When enabled - will show code as grayscale to see matches more easily.|
|findJump.activateToToggle|**true**|When enabled - will toggle active state for default `findJump.activate*` commands.|
|findJump.jumpCursorPosition|"start"|Place where to jump cursor.|
|findJump.letterBackground|"\#4169E1"|Background color of the extension&#39;s main decoration: letter to jump.|
|findJump.letterForeground|"\#ffffff"|Color of the extension&#39;s main decoration: letter to jump.|
|findJump.matchBackground|"editor\.wordHighlightBackground"||
|findJump.matchForeground|""||
|findJump.scrollbarMatchForeground|"\#4169E1"|Color of the matches in the scrollbar area.|
|findJump.light|\{\}|Overwrite colors for light themes.|
<!-- SETTINGS_END -->

> Color settings support referencing [Theme Color Id](https://code.visualstudio.com/api/references/theme-color).


# TODO (in the future):

- [ ] ✨ Option to search in all visible editors (split/grid)
- [ ] ✨ Command to go to the next/previous match