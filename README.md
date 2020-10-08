# About
Default set of prod dependencies for pckg.

## PHP
 - JSON, CURL, GD, Intl, mbstring, XML, ZIP
 - Pckg: Framework, Migrator, Manager, Queue, Helpers (JS/LESS), Auth, Translator
 - Carbon, UUID

`$ composer require pckg-app/frontend`

## JS
 - Vue, VueX, Vue Router
 - Jquery, Moment
 - Mocha, Webpack 
 
`$ yarn add pckg-app-frontend`

## Webpack
`const { merge } = require('webpack-merge');`

`const base = require('pckg-app-frontend/webpack.base.js');`

`module.exports = merge(base, { entry: { ... }});`