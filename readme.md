[![Apache V2 License](http://img.shields.io/badge/license-Apache%20V2-blue.svg)](https://github.com/Comcast/patternlab-edition-node-webpack/blob/master/LICENSE)

# Pattern Lab Node - Webpack Edition

The webpack wrapper around [Pattern Lab Node Core](https://github.com/pattern-lab/patternlab-node) providing tasks to interact with the core library and move supporting frontend assets.

## Packaged Components

The webpack edition comes with the following components:

-   `patternlab-node`: [GitHub](https://github.com/pattern-lab/patternlab-node), [npm](https://www.npmjs.com/package/patternlab-node)
-   `patternengine-node-mustache`: [GitHub](https://github.com/pattern-lab/patternengine-node-mustache), [npm](https://www.npmjs.com/package/patternengine-node-mustache)
-   `pattern-lab/styleguidekit-assets-default`: [GitHub](https://github.com/pattern-lab/styleguidekit-assets-default)
-   `pattern-lab/styleguidekit-mustache-default`: [GitHub](https://github.com/pattern-lab/styleguidekit-mustache-default)

## Prerequisites

The Pattern Lab Node - webpack edition uses [Node](https://nodejs.org/en/) for core processing, [npm](https://www.npmjs.com/) to manage project dependencies, and [webpack.io](https://webpack.github.io/) to run tasks and interface with the core library. Node version 4 or higher suffices. You can follow the directions for [installing Node](https://nodejs.org/en/download/) on the Node website if you haven't done so already. Installation of Node will include npm.

## Quickstart Guide

_Note: You must have all of the prerequisites first_

1.  Download the `.zip` or fork this repository, then clone it locally.
    > `git clone git@github.com:YOURGROUP/patternlab-edition-node-webpack.git`
1.  In a terminal window, navigate to the downloaded directory
    > `cd path/to/patternlab-edition-node-webpack`
1.  To populate Patternlab with sample data, install a starter kit, there are many [starterkits](https://github.com/pattern-lab?utf8=%E2%9C%93&q=starterkit&type=&language=) choose from
    > `npm install starterkit-mustache-demo`
1.  Generate sample files
    > `npm run patternlab:loadstarterkit --kit=starterkit-mustache-demo`
1.  Show Patternlab in a Webbrowser
    > `npm run patternlab:serve`

## Installing

`npm install`

### What's Included

The pre-built project comes with the [Base Starterkit for Mustache](https://github.com/pattern-lab/starterkit-mustache-base) installed by default.

**Please note:** Pattern Lab Node uses [npm](https://www.npmjs.com/) to manage project dependencies. To upgrade the webpack edition or to install plug-ins you'll need to be familiar with npm.

### Use npm

`npm` is a dependency management and package system which can pull in all of the webpack editions's dependencies for you. To accomplish this:

-   download or `git clone` this repository to an install location.

-   run the following

    ```
    cd install/location
    npm install
    ```

Running `npm install` from a directory containing a `package.json` file will download all dependencies defined within. The `package-lock.json` file is automatically managaged everytime you add/remove/upgrade a dependency.

#### Install the Webpack Edition of Pattern Lab Node as a Dependency

Most people want to run Pattern Lab Node standalone and not as a dependency. If you wish to install as a dependency you can do the following:

Use npm's `install` command with an argument to install the Webpack Edition into a location of your choosing. In Terminal type:

    cd install/location/
    npm install edition-node-webpack

This will install the Webpack Edition into a directory called `node_modules` in `install/location/`.

## Getting Started

The Pattern Lab Node - Webpack Edition ships with a [base experience](https://github.com/pattern-lab/starterkit-mustache-base) which serves as clean place to start from scratch with Pattern Lab. But if you want to get rolling with a starterkit of your own, or use the [demo starterkit](https://github.com/pattern-lab/starterkit-mustache-demo) like the one on [demo.patternlab.io](http://demo.patternlab.io), you can do so automatically at time of `npm install` by adding your starterkit to the `package.json` file.

You can also [work with starterkits using the command line](https://github.com/pattern-lab/patternlab-node/wiki/Importing-Starterkits).

## Updating Pattern Lab

To update Pattern Lab please refer to each component's GitHub repository, and the [master instructions for core](https://github.com/pattern-lab/patternlab-node/wiki/Upgrading). The components are listed at the top of the README.

### List all of the available commands

To list all available commands type:

    npm run patternlab:help

### Generate Pattern Lab

To generate the front-end for Pattern Lab type:

    npm run patternlab:build

### Watch for changes and re-generate Pattern Lab

To watch for changes, re-generate the front-end, and server it via a BrowserSync server, type:

    npm run patternlab:serve

Webpack dev server should open [http://localhost:3000](http://localhost:3000) in your browser, both host and port are configurable in the `patternlab-config.json` file.

### Install a StarterKit

To install a specific StarterKit from GitHub type:

    npm install [starterkit-name]

    npm run patternlab:loadstarterkit --kit=[starterkit-name]

### Pattern Lab - Configuration

Unlike the other editions, there were a few options added just for this edition that allow for easier upgrading, and better flexibility.

#### Custom Webpack Configuration and Merge Options

In this edition, it's important to make the configuration for webpack something very easy to update, and very easy to modify. The current setting for webpack custom configuration and merge are described [here.](https://github.com/Comcast/patternlab-edition-node-webpack/blob/master/source/_app/readme.md)

You can change how it merges by changing this object in `patternlab-config.json`:

```javascript
    "webpackMerge": {
        "entry": "replace"
    },
```
By default merge does a `append` if that option works for you only set which webpack configuration you want to change. The merge setting is: `smartStrategy` which is documented over on this [page.](https://www.npmjs.com/package/webpack-merge#mergesmartstrategy-key-prependappendreplaceconfiguration--configuration)

#### Setting Webpack Dev Server

You can set several options to configure your dev server. You can also in the CLI pass any option on demand.

```javascript
    "webpackDevServer": {
        "url": "http://localhost",
        "port": 3000,
        "watchContentBase": true,
        "watchOptions": {
            "aggregateTimeout": 500,
            "ignored": [],
            "info-verbosity": "verbose"
        }
    },
```
#### Modifying the compression settings for bundles

You can safely modify the following settings in the the main `webpack.babel.config` that can change how the bundles get optimized.

_Note: in webpack 4, these settings are automatically triggered when `mode=production` when running the dev server this is not used._

All uglify settings are in the `patternlab-config.json`:

```javascript
    "uglify": {
        "sourceMap": false,
        "parallel": true,
        "uglifyOptions": {
            "mangle": false
        }
    },
```
#### Namespace
In some cases you may want to add a namespace to your JS or CSS/SCSS files. You can now add a global `NAMESPACE` which can be read by any JS module. The sample of .scss includes how to use it in a `.SCSS` file.

This can be changed in the`patternlab-config.json` under `app`:

```javascript
    "app": {
        "namespace": ""
    }
```
### Licenses
* [babel-cli](https://github.com/babel/babel/blob/master/LICENSE) - MIT
* [babel-core](https://github.com/babel/babel/blob/master/LICENSE) - MIT
* [babel-polyfill](https://github.com/babel/babel-loader/blob/master/LICENSE) -MIT
* [babel-loader](https://github.com/babel/babel-loader/blob/master/LICENSE) -MIT
* [babel-preset-env](https://github.com/babel/babel/blob/master/LICENSE) - MIT
* [babel-register](https://github.com/babel/babel-loader/blob/master/LICENSE) -MIT
* [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin/blob/master/LICENSE) - MIT
* [event-hooks-webpack-plugin](https://github.com/cascornelissen/event-hooks-webpack-plugin/blob/master/LICENSE.md) - MIT
* [globby](https://github.com/sindresorhus/globby/blob/master/license) - MIT
* [patternlab-node](https://github.com/pattern-lab/patternlab-node/blob/master/LICENSE) - MIT
* [styleguidekit-assets-default](https://github.com/pattern-lab/styleguidekit-assets-default/blob/master/LICENSE) - MIT
* [styleguidekit-mustache-default](https://github.com/pattern-lab/styleguidekit-mustache-default/blob/master/LICENSE) - MIT
* [uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin/blob/master/LICENSE) - MIT
* [webpack](https://github.com/webpack/webpack/blob/master/LICENSE) - MIT
* [webpack-config-utils](https://github.com/kentcdodds/webpack-config-utils/blob/master/LICENSE) - MIT
* [webpack-dev-server](https://github.com/webpack/webpack-dev-server/blob/master/LICENSE) - MIT
* [webpack-merge](https://github.com/survivejs/webpack-merge/blob/master/LICENSE) - MIT

### Contributors

| | | |
----------- | :-------------- | :-- |
| ![@Josh68](https://avatars2.githubusercontent.com/u/771447?s=75&v=4)| **Josh Schneider** | [GitHub](https://github.com/Josh68)
| ![@paintedbicycle](https://avatars3.githubusercontent.com/u/371114?s=75&v=4)| **Paul Wright** | [Website](https://paintedbicycle.com)
````
