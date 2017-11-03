[![Apache V2 License](http://img.shields.io/badge/license-Apache%20V2-blue.svg)](https://github.com/Comcast/patternlab-edition-node-webpack/blob/master/LICENSE)


# Pattern Lab Node - Webpack Edition
The webpack wrapper around [Pattern Lab Node Core](https://github.com/pattern-lab/patternlab-node) providing tasks to interact with the core library and move supporting frontend assets.



## Installation and Starting

1. `yarn install` or `npm install`
2. `yarn start` or `npm run start`


## Packaged Components

The webpack edition comes with the following components:

* `patternlab-node`: [GitHub](https://github.com/pattern-lab/patternlab-node), [npm](https://www.npmjs.com/package/patternlab-node)
* `patternengine-node-mustache`: [GitHub](https://github.com/pattern-lab/patternengine-node-mustache), [npm](https://www.npmjs.com/package/patternengine-node-mustache)
* `pattern-lab/styleguidekit-assets-default`: [GitHub](https://github.com/pattern-lab/styleguidekit-assets-default)
* `pattern-lab/styleguidekit-mustache-default`: [GitHub](https://github.com/pattern-lab/styleguidekit-mustache-default)

## Prerequisites

The Pattern Lab Node - webpack edition uses [Node](https://nodejs.org/en/) for core processing, [npm](https://www.npmjs.com/) to manage project dependencies, and [webpack.io](https://webpack.github.io/) to run tasks and interface with the core library. Node version 4 or higher suffices. You can follow the directions for [installing Node](https://nodejs.org/en/download/) on the Node website if you haven't done so already. Installation of Node will include npm. Also includes [yarn package manager](https://yarnpkg.com/en/docs/install) which makes things a bit easier to manage.

## Installing

There's two options for installing this version: 

1. `yarn install` (Preferred)
2. `npm install`

### What's Included

 The pre-built project comes with the [Base Starterkit for Mustache](https://github.com/pattern-lab/starterkit-mustache-base) installed by default.

**Please note:** Pattern Lab Node uses [npm](https://www.npmjs.com/) to manage project dependencies. To upgrade the webpack edition or to install plug-ins you'll need to be familiar with npm.

### Use npm (yarn)

`npm` is a dependency management and package system which can pull in all of the webpack editions's dependencies for you. To accomplish this:

* download or `git clone` this repository to an install location.

* run the following

    ```
    cd install/location
    yarn install
    ```

Running `yarn install` or `npm install` from a directory containing a `package.json` file will download all dependencies defined within. The `yarn.lock` file is automatically managaged everytime you add/remove/upgrade a dependency. Currently `yarn` is faster than `npm` so it's the preferred method of running scripts. 

## Getting Started

The Pattern Lab Node - Webpack Edition ships with a [base experience](https://github.com/pattern-lab/starterkit-mustache-base) which serves as clean place to start from scratch with Pattern Lab. But if you want to get rolling with a starterkit of your own, or use the [demo starterkit](https://github.com/pattern-lab/starterkit-mustache-demo) like the one on [demo.patternlab.io](http://demo.patternlab.io), you can do so automatically at time of `yarn install` by adding your starterkit to the `package.json` file.

You can also [work with starterkits using the command line](https://github.com/pattern-lab/patternlab-node/wiki/Importing-Starterkits).

## Updating Pattern Lab

To update Pattern Lab please refer to each component's GitHub repository, and the [master instructions for core](https://github.com/pattern-lab/patternlab-node/wiki/Upgrading). The components are listed at the top of the README.

### List all of the available commands

To list all available commands type:

    yarn patternlab:help

### Generate Pattern Lab

To generate the front-end for Pattern Lab type:

    yarn patternlab:build

### Watch for changes and re-generate Pattern Lab

To watch for changes, re-generate the front-end, and server it via a BrowserSync server,  type:

    yarn patternlab:serve

Webpack dev server should open [http://localhost:3000](http://localhost:3000) in your browser, both host and port are configurable in the `patternlab-config.json` file.

### Install a StarterKit

To install a specific StarterKit from GitHub type:

    yarn add [starterkit-vendor/starterkit-name]

    yarn patternlab:loadstarterkit --kit=[starterkit-name]

### Pattern Lab - Configuration

Unlike the other editions, there were a few options added just for this edition that allow for easier upgrading, and better flexibility.

#### Setting Dev Server Settings
You can set the url and port number in the configuration for 

    "server": {
        "url": "http://localhost",
        "port": 3000
    },

#### Setting the Webpack Merge Options
In this edition, it's important to make the configuration for webpack something very easy to update, and very easy to modify. The current setting for webpack merge are described [here.](https://github.com/Comcast/patternlab-edition-node-webpack/blob/master/source/_app/readme.md)

You can change how it merges by changing this object in `patternlab-config.json`:
    
    "webpackMerge": {
        "entry":"replace"
    },

By default merge does a `append` if that option works for you only set which webpack configuration you want to change. The merge setting is: `smartStrategy` which is documented over on this [page.](https://www.npmjs.com/package/webpack-merge#mergesmartstrategy-key-prependappendreplaceconfiguration--configuration)

### Licenses
* [babel-core](https://github.com/babel/babel/blob/master/LICENSE) - MIT
* [babel-loader](https://github.com/babel/babel-loader/blob/master/LICENSE) -MIT,
* [babel-preset-es2015](https://github.com/babel/babel/blob/master/LICENSE) - MIT
* [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin/blob/master/LICENSE) - MIT
* [event-hooks-webpack-plugin](https://github.com/cascornelissen/event-hooks-webpack-plugin/blob/master/LICENSE.md) - MIT
* [globby](https://github.com/sindresorhus/globby/blob/master/license) - MIT
* [patternlab-node](https://github.com/pattern-lab/patternlab-node/blob/master/LICENSE) - MIT
* [styleguidekit-assets-default](https://github.com/pattern-lab/styleguidekit-assets-default/blob/master/LICENSE) - MIT
* [styleguidekit-mustache-default](https://github.com/pattern-lab/styleguidekit-mustache-default/blob/master/LICENSE) - MIT
* [webpack](https://github.com/webpack/webpack/blob/master/LICENSE) - MIT
* [webpack-config-utils](https://github.com/kentcdodds/webpack-config-utils/blob/master/LICENSE) - MIT
* [webpack-dev-server](https://github.com/webpack/webpack-dev-server/blob/master/LICENSE) - MIT
* [webpack-merge](https://github.com/survivejs/webpack-merge/blob/master/LICENSE) - MIT

### Special Thanks and Contributions

Contributor | Special Thanks  
----------- | --------------
 ![@rgualberto](https://avatars3.githubusercontent.com/u/5126167?v=4&s=75)[@rgualberto](https://github.com/rgualberto) | "A huge thank you to a incredible developer [Rodrigo Gualberto](https://github.com/rgualberto) for all of his hard work, dedication, and support from the start of project."
