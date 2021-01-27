const AbstractInternal = require('./abstract.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

class ScssInternal extends AbstractInternal {

    constructor(Loader) {
        super(/\.s(c|a)ss$/, [
                // Creates `style` nodes from JS strings
                MiniCssExtractPlugin.loader,//'style-loader', // MiniCss on prod, style-loader on dev?
                //'css-loader',
                // // Translates CSS into CommonJS ?
                {loader: 'css-loader', options: {importLoaders: 1}},
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
            ]
        );
    }

}

module.exports = ScssInternal;