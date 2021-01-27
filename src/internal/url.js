const AbstractInternal = require('./abstract.js');

class UrlInternal extends AbstractInternal {

    constructor(Loader) {
        super(/\.(png|jpg|gif|svg)$/, [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                    }
                }
            ]
        );
    };

}

module.exports = UrlInternal;