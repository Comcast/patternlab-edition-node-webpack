// webpack.config.js
const webpack = require("webpack");
const path = require("path");
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
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const atImport = require("postcss-import");
const url = require("postcss-url");

module.exports = env => {
    const { ifProduction, ifDevelopment } = getIfUtils(env);

    const entries = () => {
        const dynamicJSEntries = toWebpackEntry({
            from: plConfig.paths.source.root,
            files: ["**/*.js", "!**/*.test.js", "!_app", "!styleguide"],
            to: plConfig.paths.public.root
        });

        const dynamicCSSEntries = toWebpackEntry({
            from: plConfig.paths.source.root,
            files: ["**/*.css", "!_app", "!styleguide"],
            to: plConfig.paths.public.root
        });

        const staticEntries = {
        };

        const entries = Object.assign(
            {},
            dynamicCSSEntries,
            dynamicJSEntries,
            staticEntries
        );

        return entries;
    };

    const config = merge.smartStrategy(plConfig.app.webpackMerge)(
        {
            devtool: ifDevelopment("source-map"),
            context: path.resolve(__dirname, plConfig.paths.source.root),
            node: {
                fs: "empty"
            },
            entry: entries(),
            output: {
                path: path.resolve(__dirname, plConfig.paths.public.root),
                filename: "[name]"
            },
            optimization: {
                minimizer: [new UglifyJsPlugin(plConfig.app.uglify)],
                splitChunks: {
                    cacheGroups: {
                        vendor: {
                        test: /node_modules/,
                        chunks: "initial",
                        name: "js/pl-source-vendor.js",
                        priority: 10,
                        enforce: true
                        }
                    }
                }
            },
            plugins: removeEmpty([
                new ExtractTextPlugin("[name]"),
                ifDevelopment(
                    new webpack.HotModuleReplacementPlugin(),
                    new webpack.NamedModulesPlugin()
                ),
                // Remove with PL Core 3.x
                new CopyWebpackPlugin([
                    {
                        // Copy all images from source to public
                        context: path.resolve(plConfig.paths.source.images),
                        from: "./**/*.*",
                        to: path.resolve(plConfig.paths.public.images)
                    },
                    {
                        // Copy favicon from source to public
                        context: path.resolve(plConfig.paths.source.root),
                        from: "./*.ico",
                        to: path.resolve(plConfig.paths.public.root)
                    },
                    // {
                    //     // Copy all web fonts from source to public
                    //     context: path.resolve(plConfig.paths.source.fonts),
                    //     from: "./*",
                    //     to: path.resolve(plConfig.paths.public.fonts)
                    // },
                    {
                        // Styleguide Copy everything but css
                        context: path.resolve(plConfig.paths.source.styleguide),
                        from: "./**/*",
                        to: path.resolve(plConfig.paths.public.root),
                        ignore: ["*.css"]
                    },
                    {
                        // Styleguide Copy and flatten css
                        context: path.resolve(plConfig.paths.source.styleguide),
                        from: "./**/*.css",
                        to: path.resolve(plConfig.paths.public.styleguide, "css"),
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
                                    return path.resolve(__dirname, filePath);
                                });
                                patternFiles.forEach(item => {
                                compilation.fileDependencies.add(item);
                                });
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
                contentBase: path.resolve(__dirname, plConfig.paths.public.root),
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
                    },
                    {
                        test: /\.css$/,
                        use: ExtractTextPlugin.extract({
                            fallback: "style-loader",
                            use: [
                                // Make CSS @imports recognizable by Webpack, ensure they are included once
                                {
                                    loader: "css-loader",
                                    options: {
                                        importLoaders: 1
                                    }
                                },
                                {
                                    loader: 'postcss-loader',
                                    options: {
                                      plugins: loader => [
                                        // Inline all CSS @import statements
                                        atImport({ root: loader.resourcePath }),
                                        url({ url: "rebase" }),
                                      ]
                                    }
                                  },
                            ]
                        })
                    },
                    {
                        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                        loader: "url-loader?limit=100000"
                    },
                ]
            }
        },
        customization(env)
    );

    return config;
};

/**
 * Creates a Webpack `entry` property e.g. `dest/filename`: `path/filename`
 * @param {string} src Input path
 * @param {string} files Input file name or glob
 * @param {string} dest Output path
 */
function toWebpackEntry({ from, files, to }) {
    const entries = {};
    const globs = files.map(file => {
        const nonNegatedPath = `${from}/${file.replace('!', '')}`;
        return file[0] === '!' ? `!${path.resolve(__dirname, nonNegatedPath)}` : path.resolve(__dirname, nonNegatedPath);
    });

    globby.sync(globs).forEach(function(filePath) {
        let outputPath = filePath.replace(`${path.resolve(__dirname, from)}/`, `${to}`);
        const extName = path.extname(filePath);

        if (extName === '.ts') {
            // Because we have everything including extensions in our entries,
            // we have to replace the file ending for typescript files to the JavaScript
            // extension manually when using TypeScript.
            // Only has an effect when TypeScript files with ts-loader are used.
            outputPath = outputPath.replace(path.basename(filePath), `${path.basename(filePath, '.ts')}.js`);
        }

        entries[`${path.relative(plConfig.paths.public.root, outputPath)}`] = filePath;
    });

    console.log(entries)

    return entries;
}

