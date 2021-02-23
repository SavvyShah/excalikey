const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  optimization: {
    minimizer: [new TerserPlugin()],
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace("@", "")}`;
          }
        }
      }
    }
  },
  entry: path.join(__dirname, "src", "index.js"),
  output: {
    path: path.join(__dirname, "public"),
    filename: "[name].[contentHash].bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, "public", "index.html"),
      template: path.join(__dirname, "src", "index.html"),
      chunksSortMode: "none",
      favicon: path.join(__dirname, "src", "assets", "favicon.ico")
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        // Checkout glob pattern docs and https://globster.xyz
        "**/*"
      ]
    })
  ],
  module: {
    // If you want to load some other stuff https://webpack.js.org/guides/asset-management
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: { auto: true }
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"]
      }
    ]
  }
};
