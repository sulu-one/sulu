# SULU [![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)
![SULU](src/logo-sm.png)
## A hackable file manager riding on Linux, Windows and OS X
This is at development! [Here some work todo](https://github.com/sulu-one/sulu/issues)!


[![Massachusetts Institute of Technology (MIT)](https://s-a.github.io/license/img/mit.svg)](/LICENSE.md#mit)
[![Discord Channel](https://img.shields.io/badge/discord-testing@reactiflux-738bd7.svg?style=flat-square)](https://discord.gg/rX7hu3D)
[![Dependency Status](https://david-dm.org/sulu-one/sulu.svg)](https://david-dm.org/sulu-one/sulu)
[![devDependency Status](https://david-dm.org/sulu-one/sulu/dev-status.svg)](https://david-dm.org/sulu-one/sulu#info=devDependencies)
[![Codacy Badge](https://www.codacy.com/project/badge/e5ce84ae276649d5ab61f4f1b264e5e0)](https://www.codacy.com/app/stephanahlf/sulu)
[![Donate](http://s-a.github.io/donate/donate.svg)](http://s-a.github.io/donate/)

## Installation

### Normal usage

**Recommended** way is to download and execute precompiled applications for different operating systems from https://github.com/sulu-one/sulu/releases. **Done**.  
Your operating system is not in in List? To build your own release. Clone this repo and type ```npm run``` to get an idea on what build script you have to hack.

Another way is the console starter command which you can install from [npmjs.org](https://www.npmjs.com/package/sulu)
```bash
$ npm install -g sulu;
$ sulu;
```

### Advanced developer usage

Use developer channel for latest versions or to [hack on SULU codes](https://github.com/sulu-one/sulu/blob/master/CONTRIBUTING.md#contributing).

## Packages
### Packagemanager
https://github.com/sulu-one/sulu-core  
```bash
$ npm install -g sulu-core
$ # sulu-core <npm-command-line-arguments>
$ sulu-core list
$ sulu-core install @npmpackage
$ sulu-core uninstall @npmpackage
```

### Development
[Examples](docs/packages.md)

## Docs
- [Documentation](/docs/)
- [Key Bindings](/docs/key-bindings.md)
- [Contributing](/CONTRIBUTING.md)
- [API](./docs/api.md)
- [License](/LICENSE.md)
