const AbstractInternal = require('./abstract.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

class LessInternal extends AbstractInternal {

    constructor(Loader) {
        super(/\.less$/, [
                'vue-style-loader',
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: Loader.publicPath
                    },
                },
                'css-loader',
                'less-loader'
            ]
        );
    }

}

module.exports = LessInternal;