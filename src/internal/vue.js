const AbstractInternal = require('./abstract.js');

class VueInternal extends AbstractInternal {

    constructor(Loader) {
        super(/\.vue$/, [
                {
                    loader: 'vue-loader',
                    options: {
                        compilerOptions: {
                            preserveWhitespace: false,
                            whitespace: 'condense'
                        },
                        prettify: false
                    }
                }
            ]
        );
    }

}

module.exports = VueInternal;