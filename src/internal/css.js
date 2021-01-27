const AbstractInternal = require('./abstract.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssLoaderPlugin = require('css-loader');

class CssInternal extends AbstractInternal {

    constructor(Loader) {
        super(/\.css$/, [
                'style-loader',
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: Loader.publicPath,
                    },
                },
                'css-loader'
            ]
        );
    }

}

module.exports = CssInternal;