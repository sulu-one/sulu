# SULU - non-production ready [![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)
![SULU](src/logo-sm.png)
## A hackable file manager riding on Linux, Windows and OS X
This is a prototype at development! [Here is a lot of work todo](https://github.com/sulu-one/sulu/issues)!


[![Massachusetts Institute of Technology (MIT)](https://s-a.github.io/license/img/mit.svg)](/LICENSE.md#mit)
[![Donate](http://s-a.github.io/donate/donate.svg)](http://s-a.github.io/donate/)
[![Discord Channel](https://img.shields.io/badge/discord-testing@reactiflux-738bd7.svg?style=flat-square)](https://discord.gg/rX7hu3D)
[![Dependency Status](https://david-dm.org/sulu-one/sulu.svg)](https://david-dm.org/sulu-one/sulu)
[![devDependency Status](https://david-dm.org/sulu-one/sulu/dev-status.svg)](https://david-dm.org/sulu-one/sulu#info=devDependencies)
[![Codacy Badge](https://www.codacy.com/project/badge/e5ce84ae276649d5ab61f4f1b264e5e0)](https://www.codacy.com/app/stephanahlf/sulu)  

## Screenshot

![Screenshot](/demo.gif)

## Short cuts

(so far) check console (F12) to get a list full list

- "tab" - "toggleActiveFileSystemView"
- "down" - "makeNextRowActive"
- "up" - "makePreviousRowActive"
- "enter" - "enterActiveRow"
- "backspace" - "navigateBackToParentFolder"
- "space" - "selectActiveRow"
- "esc" - "unselectAllRows"
- "ctrl+a" - "selectAll"
- "ctrl+shift+a" - "invertSelection"
- "ctrl+s" - "selectByFileExtension"
- "f5" - "copy"
- "f12" - "toggleDevTools"
- "ctrl+alt+left" - "historyJumpBackward"
- "ctrl+alt+right" - "historyJumpForward"
- "right" - "changeDirectory"
- "ctrl+b" - "toggleBookmark"
- "ctrl+shift+b" - "showBookmarks"
- "ctrl+y" - "copyFilenamesWithPath"
- "ctrl+shift+y" - "copyFilenames"
- "ctrl+shift+alt+y" - "copyFilenamesWithExtendedInfo"
- "ctrl+f7" - "createFile"
- "f7" - "createFolder"
- "del" - "moveToTrash"
- "f4" - "open"
- "ctrl+p" - "preview"
- "ctrl+enter" - "openShell"
- "ctrl+r" - "reload"
- "f5" - "reload"
- "ctrl+f5" - "reloadHard"
- "f2" - "rename"
- "ctrl+e" - "showItemInFolder"
- "ctrl+f12" - "settings"

## [Contributing](/CONTRIBUTING.md)

```bash


# installation

$ git clone https://github.com/sulu-one/sulu.git;
$ cd sulu;
$ npm install;
$ npm link .;

# run

$ sulu;

```

## [API](./docs/api.md)

## [License](/LICENSE.md)
