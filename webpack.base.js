/**
 * Those are all dev requirements.
 */
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const webpack = require('webpack');
const WebpackGitHash = require('webpack-git-hash');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
//const nodeExternals = require('webpack-node-externals')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const vueLoader = {
    test: /\.vue$/,
    use: [{
        loader: 'vue-loader',
        options: {
            compilerOptions: {
                preserveWhitespace: false,
                whitespace: 'condense'
            },
            prettify: false
        }
    }],
};

const esLoader = {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: [{
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env', /*'es2015'*/]
        }
    }],
};

const lessLoader = {
    test: /\.less$/,
    use: [
        'vue-style-loader',
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: '/build/js',
                hmr: false,
            },
        },
        'css-loader',
        'less-loader'
    ]
};

const cssLoader = {
    test: /\.css$/,
    use: ['style-loader',
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                // you can specify a publicPath here
                // by default it uses publicPath in webpackOptions.output
                /*publicPath: function(resourcePath, context){
                    // publicPath is the relative path of the resource to the context
                    // e.g. for ./css/admin/main.css the publicPath will be ../../
                    // while for ./css/main.css the publicPath will be ../
                    return path.relative(path.dirname(resourcePath), context) + '/';
                },*/
                publicPath: '/build/js',
                hmr: false,
            },
        }, 'css-loader'],
};

const urlLoader = {
    test: /\.(png|jpg|gif|svg)$/,
    loader: 'url-loader',
    options: {
        limit: 10000,
    },
};

const fontLoader = {
    test: /.(eot|ttf|otf|svg|woff(2)?)(\?[a-z0-9]+)?$/,
    use: [
        {
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: 'fonts/',    // where the fonts will go
                //publicPath: '../'       // override the default path
            }
        }
    ]
};

const babelLoader = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [
        {
            loader: 'babel-loader',
            //options: {
            //    presets: ['@babel/preset-env', /*'es2015'*/]
            //}
        }
    ]
};

module.exports = {
    mode: 'production',
    plugins: [
        //new CleanWebpackPlugin(),
        new HardSourceWebpackPlugin(),
        new VueLoaderPlugin(),
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
            jQuery: "jquery"
        })
    ],
    resolve: {
        alias: {
            //'vue$': 'vue/dist/vue.common.js',
            'vue$': 'vue/dist/vue.esm.js', // 'vue/dist/vue.common.js' for webpack 1
            jquery: "jquery/src/jquery",
            $: "jquery/src/jquery",
            tinymce: "tinymce/tinymce",
            Dropzone: "dropzone/dropzone",
        }
    },
    module: {
        rules: [vueLoader, cssLoader, urlLoader, esLoader, babelLoader, fontLoader, lessLoader],
    },
    output: {
        chunkFilename: 'chunk.[contenthash].js',
        filename: '[name].js',
        path: __dirname + '/build/js',
        publicPath: '/build/js/'
    },
    optimization: {
        minimize: true,
        minimizer: [
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
                cache: true,
                test: /\.js(\?.*)?$/i,
                //parallel: true,
                parallel: 4,
                sourceMap: false,
                terserOptions: {
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
                    output: {
                        comments: false,
                    },
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            })
        ],
    },
    // externals: [nodeExternals()], // only in cli
};