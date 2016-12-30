# ![SULU](src/logo-sm.png) SULU

## A ```</hackable>``` ```[package-driven]``` File Manager ```{CROSS_PLATFORM}```

[![Massachusetts Institute of Technology (MIT)](https://s-a.github.io/license/img/mit.svg)](/LICENSE.md#mit)
[![Discord Channel](https://img.shields.io/badge/discord-testing@reactiflux-738bd7.svg?style=flat-square)](https://discord.gg/rX7hu3D)
[![Dependency Status](https://david-dm.org/sulu-one/sulu.svg)](https://david-dm.org/sulu-one/sulu)
[![devDependency Status](https://david-dm.org/sulu-one/sulu/dev-status.svg)](https://david-dm.org/sulu-one/sulu#info=devDependencies)
[![Codacy Badge](https://www.codacy.com/project/badge/e5ce84ae276649d5ab61f4f1b264e5e0)](https://www.codacy.com/app/stephanahlf/sulu)
[![Donate](http://s-a.github.io/donate/donate.svg)](http://s-a.github.io/donate/)

## Installation

A full [list of supported platforms](docs/supported-platforms.md) are available in the [docs](/docs/) folder.

- Easy setup
 - **Recommended** way is to download and execute precompiled applications for different operating systems from [releases](https://github.com/sulu-one/sulu/releases).  
 **Done**.  
_
If your operating system is not in List you can build your own release. Open the ```package.json``` and checkout the script ```build-windows``` to learn how create a build job for your os. Currently we use [electron-builder](https://github.com/electron-userland/electron-builder) but there are tons of other build tools online._
- Another way is the console starter command which you can install from [npmjs.org](https://www.npmjs.com/package/sulu)
```bash
$ npm install -g sulu;
$ sulu;
```
- If you like to hack the SULU codes we recommend the  [Contributing](https://github.com/sulu-one/sulu/blob/master/CONTRIBUTING.md#contributing) Docs

## Packages

Since SULU is a package driven application there exists a command line shell tool called [```sulu-core```](https://github.com/sulu-one/sulu-core).
### Packagemanager

You can install the SULU package manager with

```bash
$ npm install -g sulu-core
```

### Packagemanager usage

Currently a typical update process is: 
```bash
$ sulu-core outdated # list available updates
$ sulu-core update # update all packages
# press ctrl+f5 to refresh SULU application
```

More commands:
```bash
$ sulu-core list # list installed packages
$ sulu-core install @npmpackage # install package
$ sulu-core uninstall @npmpackage # uninstall package
# sulu-core <npm-command-line-arguments>
```
For more Details see the [sulu-core project page](https://github.com/sulu-one/sulu-core).

## Contributing

If you like to fix or improve SULU or create your own package for SULU read the [Contributing Docs ](https://github.com/sulu-one/sulu/blob/master/CONTRIBUTING.md#contributing) first.

### Write your own package

- _TODO: "ADD-HELLO-WORLD-EXAMPLE"_
- Study [pre-installed and featured packages](docs/packages.md) to learn what is possible.
- Read the [API Docs](./docs/api.md) to get a full list of API specification.

## More docs
- [Key Bindings](/docs/key-bindings.md)
- [All documentations](/docs/)

# License
This project is [MIT Licensed](/LICENSE.md)
