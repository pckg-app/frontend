const AbstractInternal = require('./abstract.js');

class EsInternal extends AbstractInternal {

    constructor(Loader) {
        super(/\.js$/, [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', /*'es2015'*/]
                    }
                }
            ]
        );
        this.base = {
            exclude: /(node_modules|bower_components)/
        };
    }

}

module.exports = EsInternal;