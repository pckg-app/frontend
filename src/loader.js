/**
 * Those are all dev requirements.
 */
const {merge} = require('webpack-merge');
//const webpack = require('webpack');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const webpack = require('webpack');
const WebpackGitHash = require('webpack-git-hash');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
//const nodeExternals = require('webpack-node-externals')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const Modes = {
    PRODUCTION: 'production',
    DEVELOPMENT: 'development',
};

class Loader {

    constructor(packages) {
        this.internals = {
            vue: 'vue',
            js: 'es',
            less: 'less',
            css: 'css',
            url: 'url',
            font: 'font',
            scss: 'scss'
        };
        this.packages = packages || [];
        this.loaders = [];
        this.buildPath = this.publicPath = '/build';
        this.mode = Modes.PRODUCTION;
        this.base = {};
        this.$entry = {};
        this.$chunk = true;
    }

    setMode(mode) {
        this.mode = mode;

        return this;
    }

    modeDev() {
        return this.setMode(Modes.DEVELOPMENT);
    }

    get isDev() {
        return this.mode === Modes.DEVELOPMENT;
    }

    modeProd() {
        return this.setMode(Modes.PRODUCTION);
    }

    get isProd() {
        return this.mode === Modes.PRODUCTION;
    }

    entry(entries) {
        this.$entry = entries || {};

        return this;
    }

    logs(...logs) {
        console.log(...logs);

        return this;
    }

    chunk(chunk) {
        this.$chunk = arguments.length > 0 ? chunk : true;

        return this;
    }

    setBuildPath(buildPath) {
        this.buildPath = buildPath;

        return this;
    }

    get moduleRules() {
        this.logs('building rules', this.packages);
        return this.packages.filter((key) => {
            return !!this.internals[key];
        }).map((key) => {
            this.logs('Loading rules for ' + key);
            let c = this.internals[key];
            let o = require('./internal/' + c + '.js');

            o = new o(this);

            return o.buildModuleRule(this);

            return this[c + 'Loader']();
        });
    }

    get optimizationMinimizer() {
        if (this.isDev) {
            return [];
        }

        return [
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        'default',
                        {
                            discardComments: {removeAll: true},
                        },
                    ],
                },
            }),
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                //parallel: true,
                parallel: 4,
                terserOptions: {
                    sourceMap: false,
                    ecma: undefined,
                    warnings: true,
                    parse: {},
                    compress: true,
                    //ecma: 6,
                    mangle: true,
                    module: false,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: false,
                    safari10: false,
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            })
        ]
    }

    exports(config) {
        let exp = merge(merge({
            mode: this.mode,
            entry: this.$entry,
            plugins: [
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: JSON.stringify(this.mode)
                    },
                    'production': this.mode
                }),
                //new CleanWebpackPlugin(),
                new HardSourceWebpackPlugin(),
                new VueLoaderPlugin(), // added by vue.js
                new MiniCssExtractPlugin({
                    // Options similar to the same options in webpackOptions.output
                    // both options are optional
                    filename: '[name].css',
                    chunkFilename: '[contenthash].css',
                }),
                new webpack.IgnorePlugin(/\.\/locale$/),
                new WebpackGitHash(),
                new webpack.ProvidePlugin({
                    $: "jquery",
                    jQuery: "jquery",
                    //process: 'process/browser',
                })
            ],
            externals: {
                //jquery: 'jQuery',
            },
            resolve: {
                alias: {
                    //'vue$': 'vue/dist/vue.common.js',
                    'vue$': 'vue/dist/vue.esm.js', // 'vue/dist/vue.common.js' for webpack 1
                    jquery: "jquery/src/jquery",
                    $: "jquery/src/jquery",
                    tinymce: "tinymce/tinymce",
                    Dropzone: "dropzone/dropzone",
                },
                // If you are using node.something: 'empty' replace it with resolve.fallback.something: false.
                /*fallback: {
                    "fs": false,
                    "tls": false,
                    "net": false,
                    "path": false,
                    "zlib": false,
                    "http": false,
                    "https": false,
                    "stream": false,
                    "crypto": false,
                    "crypto-browserify": false,
                    //"process": false
                }*/
            },
            module: {
                rules: this.moduleRules,
            },
            //target: ['web', 'es5'],
            output: {
                chunkFilename: 'chunk.[contenthash].js',
                path: path.resolve(__dirname, '../../..'),
                publicPath: this.publicPath + '/'
            },
            optimization: {
                minimize: true,
                minimizer: this.optimizationMinimizer,
            },
            // externals: [nodeExternals()], // only in cli
        }, config || {}), this.base);

        if (!this.$chunk) {
            exp = merge(exp, {
                plugins: [
                    new webpack.optimize.LimitChunkCountPlugin({
                        maxChunks: 1
                    }),
                ],
                optimization: {
                    splitChunks: {
                        cacheGroups: {
                            default: false,
                        },
                    },
                    runtimeChunk: false
                }
            })
        }

        return exp;
    }

}

module.exports = Loader;