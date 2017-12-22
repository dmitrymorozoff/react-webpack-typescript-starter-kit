const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const devServer = require("./configs/devserver.config");
const sass = require("./configs/sass.config");
const css = require("./configs/css.config");
const extractCSS = require("./configs/css.extract.config");
const uglifyJS = require("./configs/uglify.config");

const commonConfig = webpackMerge([
    {
        entry: ["babel-polyfill", "./source/client/index.tsx"],
        output: {
            path: path.join(__dirname, "../dist"),
            publicPath: "",
            filename: "js/bundle.js",
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".css", ".scss", ".sass"],
            modules: [path.resolve("./source/client"), "node_modules"],
        },
        module: {
            rules: [
                {
                    test: [/\.tsx?$/],
                    enforce: "pre",
                    loader: "tslint-loader",
                    exclude: /node_modules/,
                    options: {
                        emitErrors: true,
                    },
                },
                {
                    test: /\.tsx?$/,
                    loader: ["babel-loader", "awesome-typescript-loader"],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./source/client/index.html",
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    removeOptionalTags: true,
                },
                hash: true,
            }),
            new CopyWebpackPlugin(
                [
                    {
                        from: "source/client/assets",
                        to: "assets",
                    },
                ],
                {},
            ),
            new webpack.ProvidePlugin({
                React: ["react"],
            }),
        ],
    },
]);

module.exports = env => {
    switch (env) {
        case "production":
            commonConfig.plugins.push(
                new webpack.optimize.CommonsChunkPlugin({
                    name: "vendors",
                    filename: "js/vendors.js",
                    minChunks: module => {
                        const userRequest = module.userRequest;
                        if (typeof userRequest !== "string") {
                            return false;
                        }
                        return userRequest.indexOf("node_modules") >= 0 || userRequest.indexOf("libraries") >= 0;
                    },
                }),
            );
            return webpackMerge([commonConfig, extractCSS(), uglifyJS()]);
        case "development":
            return webpackMerge([commonConfig, devServer(), sass(), css()]);
        default:
            return commonConfig;
    }
};
