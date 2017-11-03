# _app

Used to store your app specific files.

## Includes

**Custom Webpack Configuration**

`webpack.app.js` this file is used to place your custom webpack configuration. This will merge or override the values in `webpack.config.babel.js` This will provide a way to change your configuration and still get updates in the future.

### More information

For details into how webpack merge works, and all the options you can do, check out their page:
[Webpack Merge](https://www.npmjs.com/package/webpack-merge#mergesmartstrategy-key-prependappendreplaceconfiguration--configuration)