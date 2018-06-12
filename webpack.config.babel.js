// webpack.config.js
const webpack = require("webpack");
const { resolve } = require("path");
const globby = require("globby");
const { getIfUtils, removeEmpty } = require("webpack-config-utils");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const EventHooksPlugin = require("event-hooks-webpack-plugin");
const plConfig = require("./patternlab-config.json");
const patternlab = require("patternlab-node")(plConfig);
const patternEngines = require("patternlab-node/core/lib/pattern_engines");
const merge = require("webpack-merge");
const customization = require(`${plConfig.paths.source.app}/webpack.app.js`);
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = env => {
  const { ifProduction, ifDevelopment } = getIfUtils(env);

  const config = merge.smartStrategy(plConfig.app.webpackMerge)(
    {
      devtool: ifDevelopment("source-map"),
      context: resolve(__dirname, plConfig.paths.source.root),
      node: {
        fs: "empty"
      },
      entry: {
        // Gathers any Source JS files and creates a bundle
        //NOTE: This name can be changed, if so, make sure to update _meta/01-foot.mustache
        "js/pl-source": globby
          .sync([
            resolve(__dirname, `${plConfig.paths.source.js}**/*.js`),
            "!**/*.test.js"
          ])
          .map(function(filePath) {
            return filePath;
          })
      },
      output: {
        path: resolve(__dirname, plConfig.paths.public.root),
        filename: "[name].js"
      },
      optimization: {
        minimizer: [new UglifyJsPlugin(plConfig.app.uglify)],
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /node_modules/,
              chunks: "initial",
              name: "js/pl-source-vendor",
              priority: 10,
              enforce: true
            }
          }
        }
      },
      plugins: removeEmpty([
        ifDevelopment(
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NamedModulesPlugin()
        ),
        // Remove with PL Core 3.x
        new CopyWebpackPlugin([
          {
            // Copy all images from source to public
            context: resolve(plConfig.paths.source.images),
            from: "./**/*.*",
            to: resolve(plConfig.paths.public.images)
          },
          {
            // Copy favicon from source to public
            context: resolve(plConfig.paths.source.root),
            from: "./*.ico",
            to: resolve(plConfig.paths.public.root)
          },
          {
            // Copy all web fonts from source to public
            context: resolve(plConfig.paths.source.fonts),
            from: "./*",
            to: resolve(plConfig.paths.public.fonts)
          },
          {
            // Copy all css from source to public
            context: resolve(plConfig.paths.source.css),
            from: "./*.css",
            to: resolve(plConfig.paths.public.css)
          },
          {
            // Styleguide Copy everything but css
            context: resolve(plConfig.paths.source.styleguide),
            from: "./**/*",
            to: resolve(plConfig.paths.public.root),
            ignore: ["*.css"]
          },
          {
            // Styleguide Copy and flatten css
            context: resolve(plConfig.paths.source.styleguide),
            from: "./**/*.css",
            to: resolve(plConfig.paths.public.styleguide, "css"),
            flatten: true
          }
        ]),
        ifDevelopment(
          new EventHooksPlugin({
            afterEmit: function(compilation) {
              const supportedTemplateExtensions = patternEngines.getSupportedFileExtensions();
              const templateFilePaths = supportedTemplateExtensions.map(
                function(dotExtension) {
                  return `${plConfig.paths.source.patterns}**/*${dotExtension}`;
                }
              );

              // additional watch files
              const watchFiles = [
                `${plConfig.paths.source.patterns}**/*.(json|md|yaml|yml)`,
                `${plConfig.paths.source.data}**/*.(json|md|yaml|yml)`,
                `${plConfig.paths.source.fonts}**/*`,
                `${plConfig.paths.source.images}**/*`,
                `${plConfig.paths.source.meta}**/*`,
                `${plConfig.paths.source.annotations}**/*`
              ];

              const allWatchFiles = watchFiles.concat(templateFilePaths);

              allWatchFiles.forEach(function(globPath) {
                const patternFiles = globby
                  .sync(globPath)
                  .map(function(filePath) {
                    return resolve(__dirname, filePath);
                  });

                patternFiles.forEach(item => {
                  compilation.fileDependencies.add(item);
                });
                const iterator1 = compilation.fileDependencies.entries();
              });
            }
          })
        ),
        new EventHooksPlugin({
          done: function(stats) {
            let cleanPublic = plConfig.cleanPublic;
            process.argv.forEach((val, index) => {
              if (val.includes("cleanPublic")) {
                val = val.split("=");
                cleanPublic = JSON.parse(val[1]);
              }
            });

            patternlab.build(() => {}, cleanPublic);
          }
        })
      ]),
      devServer: {
        contentBase: resolve(__dirname, plConfig.paths.public.root),
        publicPath: `${plConfig.app.webpackDevServer.url}:${plConfig.app.webpackDevServer.port}`,
        port: plConfig.app.webpackDevServer.port,
        open: true,
        hot: true,
        watchContentBase: plConfig.app.webpackDevServer.watchContentBase,
        watchOptions: plConfig.app.webpackDevServer.watchOptions
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: [
              {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true
                }
              }
            ]
          }
        ]
      }
    },
    customization(env)
  );

  return config;
};
