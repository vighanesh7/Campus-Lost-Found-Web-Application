// Syllabus demo only. The real React app is built by Vite (see ../frontend).
const path = require('path');
module.exports = {
  entry: './src/index.js',                       // 1. starting file
  output: { filename: 'bundle.js', path: path.resolve(__dirname, 'dist'), clean: true }, // 2. output bundle
  module: { rules: [] },                         // 3. loaders go here (babel-loader, css-loader ...)
  plugins: [],                                   // 4. plugins go here (HtmlWebpackPlugin ...)
  devtool: 'source-map',
};
