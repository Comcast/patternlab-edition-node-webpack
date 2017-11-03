// webpack.config.js
const webpack = require('webpack');
const {resolve} = require('path');
const globby = require('globby');
const {getIfUtils, removeEmpty} = require('webpack-config-utils');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const EventHooksPlugin = require('event-hooks-webpack-plugin');
const plConfig = require('./patternlab-config.json');
const patternlab = require('patternlab-node')(plConfig);
const patternEngines = require('patternlab-node/core/lib/pattern_engines');
const merge = require('webpack-merge');
const customization = require(`${plConfig.paths.source.app}/webpack.app.js`);

module.exports = env => {
  const {ifProd, ifDev} = getIfUtils(env);
  
  const config = merge.smartStrategy(plConfig.webpackMerge)({
    devtool: ifDev('source-map'),
    context: resolve(__dirname, 'source'),
    node: {
      fs: "empty"
    },
    entry: { 
      // Gathers any Source JS files and creates a bundle
      //NOTE: This name can be changed, if so, make sure to update _meta/01-foot.mustache
      "js/pl-source": 
          globby.sync([resolve(plConfig.paths.source.js + '**/*.js')]).map(function (filePath) {
          return filePath;
        })
    },
    output: {
      path: resolve(__dirname, 'public'),
      filename: '[name].js'
    },
    plugins:  removeEmpty([
      ifDev(
        // Live reloading in development only
        new webpack.HotModuleReplacementPlugin()
      ),
      ifProd(
        new webpack.optimize.UglifyJsPlugin({
          // Compresses in production any bundle
          sourceMap: true,
          uglifyOptions: {
            mangle: false
          }
        })
      ),
      new webpack.optimize.CommonsChunkPlugin({
        // Combines any node module libraries used into their own file
        name: 'js/pl-vendor-libraries',
        chunks: ['js/pl-source'],
        minChunks: module => {
          return module.context && /node_modules/.test(module.context);
        }
      }),
      new CopyWebpackPlugin([
        {
          // Copy all images from source to public
          context: resolve(plConfig.paths.source.images),
          from: './**/*.*',
          to: resolve(plConfig.paths.public.images)
        },
        {
          // Copy favicon from source to public
          context: resolve(plConfig.paths.source.root),
          from: './*.ico',
          to: resolve(plConfig.paths.public.root)
        },
        {
          // Copy all web fonts from source to public
          context: resolve(plConfig.paths.source.fonts),
          from: './*',
          to: resolve(plConfig.paths.public.fonts)
        },
        {
          // Copy all css from source to public
          context: resolve(plConfig.paths.source.css),
          from: './*.css',
          to: resolve(plConfig.paths.public.css)
        },
        {
          // Styleguide Copy everything but css
          context: resolve(plConfig.paths.source.styleguide),
          from: './**/*',
          to: resolve(plConfig.paths.public.root),
          ignore: ['*.css']
        },
        {
          // Styleguide Copy and flatten css
          context: resolve(plConfig.paths.source.styleguide),
          from: './**/*.css',
          to: resolve(plConfig.paths.public.styleguide, 'css'),
          flatten: true
        }
      ]),
      new EventHooksPlugin({
        // Before WebPack compiles, call the pattern build API, once done, bundle continues
        'before-compile': function(compilationParams, callback){
          patternlab.build(callback, plConfig.cleanPublic);
        }
      }),
      new EventHooksPlugin({
        'after-compile': function(compilation, callback) {  
          // watch supported templates
          const supportedTemplateExtensions = patternEngines.getSupportedFileExtensions();
          const templateFilePaths = supportedTemplateExtensions.map(function (dotExtension) {
            return plConfig.paths.source.patterns + '/**/*' + dotExtension;
          });

          // additional watch files
          const watchFiles = [
            plConfig.paths.source.patterns + '/**/*.json',
            plConfig.paths.source.patterns + '**/*.md',
            plConfig.paths.source.data + '**/*.json',
            plConfig.paths.source.fonts + '**/*',
            plConfig.paths.source.images + '**/*',
            plConfig.paths.source.js + '**/*',
            plConfig.paths.source.meta + '**/*',
            plConfig.paths.source.annotations + '**/*'
          ];

          const allWatchFiles = watchFiles.concat(templateFilePaths);

          allWatchFiles.forEach(function(globPath) {
            const patternFiles = globby.sync(globPath).map(function (filePath) {
              return resolve(filePath);
            });

            compilation.fileDependencies = compilation.fileDependencies.concat(patternFiles);
          });

          // signal done and continue with build
          callback();
        }
      }),
    ]),
    devServer: {
      contentBase: resolve(__dirname, 'public'),
      port: plConfig.server.port,
      open:true,
      watchContentBase: false
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: resolve('node_modules'),
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [
                ['es2015', { modules: false }]
              ]
            }
          }]
        }
      ]
    }
  }, customization(env))

  return config
}
