var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: ['babel-polyfill', 'es6-promise', 'whatwg-fetch', './static/app.js'],
	output: {
		path: './public/build/',
		publicPath: './public/build/',
		filename: 'bundle.js'
	},
	module: {
		loaders: 
			[
				{
					test: /\.js$/,
					exclude: [ /node_modules/, /public/ ],
					loader: 'babel',
					query: {
						"presets": ["es2015", "stage-0", "react"]
					}
				},
				{
					test: /\.jsx$/,
					exclude: [ /node_modules/, /public/ ],
					loader: 'babel',
					query: { 
						"presets": ["es2015", "stage-0", "react"]
					}
				},
				{
					test: /\.sass$/,
					exclude: [ /node_modules/, /public/ ],
					loader: "style-loader!css-loader!autoprefixer-loader!sass"
				}
			]
	},
	devServer: {
		hot: true
	}
}