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

/**
 * Load vue-loader for VueJS single-file-components.
 */
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

/**
 * Load babel-loader to transpile .js files.
 */
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

/**
 * Load less-loader to extract LESS from .less and .vue files.
 */
const lessLoader = {
    test: /\.less$/,
    use: [
        'vue-style-loader',
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: '/build'
            },
        },
        'css-loader',
        'less-loader'
    ]
};

/**
 * Load css-loader to extract CSS from .less and .css files.
 */
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
                publicPath: '/build',
            },
        },
        'css-loader'
    ],
};

/**
 * Load url-loader to extract static contents from .less and .css files.
 */
const urlLoader = {
    test: /\.(png|jpg|gif|svg)$/,
    loader: 'url-loader',
    options: {
        limit: 10000,
    },
};

/**
 * Load file-loader to extract fonts from .less and .css files.
 */
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

/**
 * Load scss for tailwind.
 */
const scssLoader = {
    test: /\.s(c|a)ss$/,
    use: [
        // Creates `style` nodes from JS strings
        MiniCssExtractPlugin.loader,//'style-loader', // MiniCss on prod, style-loader on dev?
        //'css-loader',
        // // Translates CSS into CommonJS ?
        { loader: 'css-loader', options: { importLoaders: 1 } },
        /*{
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        [
                            "postcss-preset-env",
                            {
                                // Options
                            },
                        ],
                    ],
                },
            },
        },*/
        'postcss-loader',
        // Compiles Sass to CSS
        'sass-loader',
        /*{
            loader: 'sass-loader',
            // Requires sass-loader@^8.0.0
            options: {
                implementation: require('sass'),
                sassOptions: {
                    fiber: require('fibers'),
                    indentedSyntax: true, // optional
                    webpackImporter: true
                },
            },
        },*/
    ],
};

module.exports = {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            },
            'production': 'production'
        }),
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
        rules: [vueLoader, cssLoader, urlLoader, esLoader, fontLoader, lessLoader, scssLoader],
    },
    //target: ['web', 'es5'],
    output: {
        chunkFilename: 'chunk.[contenthash].js',
        path: __dirname + '/build',
        publicPath: '/build/'
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
        ],
    },
    // externals: [nodeExternals()], // only in cli
};