const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './static/src/index.jsx'),
  output: {
    path: path.resolve(__dirname, './static/dist'),
    filename: 'bundle.js'
  },
  mode: 'development',
  // devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  // resolve: {
  //   extensions: ['.js', '.json', '.wasm'], // Add your extensions here.
  // }
}