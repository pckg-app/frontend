const AbstractInternal = require('./abstract.js');

class FontInternal extends AbstractInternal {

    constructor(Loader) {
        super(/.(eot|ttf|otf|svg|woff(2)?)(\?[a-z0-9]+)?$/, [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',    // where the fonts will go
                        //publicPath: '../'       // override the default path
                    }
                }
            ]
        );
    }

}

module.exports = FontInternal;