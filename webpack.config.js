const CopyWebpackPlugin = require('copy-webpack-plugin');
const HandlebarsWebpackPlugin = require('handlebars-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const app = [
  `webpack-dev-server/client?http://${host}:${port}`,
  './App.jsx'
];
const baseHref = isProduction ? '/my-app/' : '/';

const plugins = [
  new webpack.DefinePlugin({
    CONFIG: JSON.stringify({
      baseHref
    })
  }),
  new CopyWebpackPlugin([
    { from: 'images', to: 'images' }
  ]),
  new HandlebarsWebpackPlugin({
    entry: path.join(process.cwd(), 'src', '*.hbs'),
    output: path.join(process.cwd(), 'docs', '[name].html'),
    data: {
      baseHref
    }
  })
];
if (isProduction) {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  );
  plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  );
} else {
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

module.exports = {
  // this is the path to your source files
  context: path.join(__dirname, 'src'),
  // this is the first file to be executed
  entry: {
    app
  },
  // local dev server configurations
  devServer: {
    host,
    port,
    contentBase: './docs',
    disableHostCheck: true,
    publicPath: baseHref,
    hot: true,
    historyApiFallback: {
      index: 'index.html'
    },
    stats: {
      colors: true
    }
  },
  // two plugins we're using. one copies images, html & css
  // from the src directory to the docs folder
  plugins,
  module: {
    // this loader uses babel to transpile our JS code
    loaders: [
      {
        test: /\.(js|jsx|es6)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [
            'es2015',
            'react',
            'stage-0'
          ]
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader'
      },
      {
        test: /\.css/,
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]__[hash:base64:5]',
          url: false
        }
      }
    ]
  },
  // the JS file that's compiled from the JSX files
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'docs')
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx'
    ]
  }
};
