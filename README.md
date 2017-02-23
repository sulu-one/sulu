# ![SULU](src/logo-sm.png) SULU

## A ```</hackable>``` ```[package-driven]``` File Manager ```{CROSS_PLATFORM}```

[![Massachusetts Institute of Technology (MIT)](https://s-a.github.io/license/img/mit.svg)](/LICENSE.md#mit)
[![Slack Channels](https://sulu-one.herokuapp.com/badge.svg)](https://sulu-one.herokuapp.com)
[![Dependency Status](https://david-dm.org/sulu-one/sulu.svg)](https://david-dm.org/sulu-one/sulu)
[![devDependency Status](https://david-dm.org/sulu-one/sulu/dev-status.svg)](https://david-dm.org/sulu-one/sulu#info=devDependencies)
[![Codacy Badge](https://www.codacy.com/project/badge/e5ce84ae276649d5ab61f4f1b264e5e0)](https://www.codacy.com/app/stephanahlf/sulu)
[![Donate](http://s-a.github.io/donate/donate.svg)](http://s-a.github.io/donate/)

## Installation


- One Click Install
  - **Recommended** way is to download and execute precompiled applications for different operating systems from [latest releases](https://github.com/sulu-one/sulu/releases). After that [update the packages](#packages).
 **Done**.
 _If your operating system is not in List you can build your own release. Open the ```package.json``` and checkout the script ```build-windows``` to learn how create a build job for your os. Currently we use [electron-builder](https://github.com/electron-userland/electron-builder) but there are tons of other build tools online._ We like Pull Requests when you resolve a build for your OS!
- If you like to hack the SULU codes we recommend the  [Contributing](https://github.com/sulu-one/sulu/blob/master/CONTRIBUTING.md#contributing) Docs

## Packages

Since SULU is a package driven application there exists a command line shell tool called [```sulu-core```](https://github.com/sulu-one/sulu-core). It aims to manage the SULU system configuration which also containts the topic package management.

### Packagemanager

You can install the SULU package manager with [npm](https://www.npmjs.com/). To make it available on your machine you need to install [Node.js®](https://nodejs.org/en/) first.

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

1. Create a simple node module in the [app node_modules folder](/app/packages/node_modules/) with the following structure.
```javascript
var remote = require('electron').remote;

var Command = function  () {
	return this;
};

Command.prototype.toggleDevTools = function toggleDevTools() {

	remote.getCurrentWindow().toggleDevTools();
	return false
};

var Plugin = function devTools(client) {
	this.command = new Command();
	client.app.registerHotKey("f12", this.command.toggleDevTools);
};

module.exports = Plugin;
```

2. Create a valid [`package.json`](https://docs.npmjs.com/files/package.json) with a property [`"suluPackage": true`](https://github.com/sulu-one/sulu-dev-tools/blob/8a6f2de1b2cea7dfa053cfcefae2cb39c90ef432/package.json#L2).

#### More to read
- The preinstalled package that handles the [delete process of SULU](https://github.com/sulu-one/sulu-file-system-view-delete/blob/5960d1e8cefc847b685e88088d00977b12ecca57/index.js
).
- Study [pre-installed and featured packages](docs/packages.md) to learn what is possible.
- Read the [SULU API Docs](./docs/api.md) to use SULU core methods.
- Read the [Electron Documentation](http://electron.atom.io/docs/api/) to use the Electron API.
- And then write a cool piece of code :sunglasses:

## More docs
- [Key Bindings](/docs/key-bindings.md)
- [Documents Index](/docs/)

# License
This project is [MIT Licensed](/LICENSE.md)
