const Loader = require('./src/loader.js')

/**
 * This will load most available plugins and loaders with default settings.
 * Make sure to call Loader.exports() to build the export array.
 */
module.exports = new Loader(['vue', 'js', 'less', 'css', 'url', 'font', 'scss']);