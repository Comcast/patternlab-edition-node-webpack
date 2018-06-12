# _app

Used to store your app specific files.

## Includes

**Custom Webpack Configuration**

The file `/source/_app/webpack.app.js` is your custom webpack configuration. This will merge or override the values in `webpack.config.babel.js`. This will provide a way to change your configuration and still get updates in the future.

**Sample Custom Configuration**

This edition includes [an example configuration](https://github.com/Comcast/patternlab-edition-node-webpack/blob/latest/source/_app/samples/scss/webpack.app.js) for loading, processing, and bundling SASS/SCSS. Use this sample as a template and modify as you like for working with any project asset-types.

### More information

For details into how webpack merge works, and all the options you can do, check out their page:
[Webpack Merge](https://www.npmjs.com/package/webpack-merge#mergesmartstrategy-key-prependappendreplaceconfiguration--configuration)