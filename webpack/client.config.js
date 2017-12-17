const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const devServer = require("./components/devserver.config");
const sass = require("./components/sass.config");
const css = require("./components/css.config");
const extractCSS = require("./components/css.extract.config");
const uglifyJS = require("./components/uglify.config");

const commonConfig = webpackMerge([
    {
        entry: ["babel-polyfill", "./source/client/index.ts"],
        output: {
            path: path.join(__dirname, "../dist"),
            filename: "js/bundle.js",
        },
        resolve: {
            extensions: [".ts", ".js", ".css", ".scss", ".sass"],
            modules: [path.resolve("./source/client"), "node_modules"],
        },
        module: {
            rules: [
                {
                    test: [/\.ts?$/],
                    enforce: "pre",
                    loader: "tslint-loader",
                    exclude: /node_modules/,
                    options: {
                        emitErrors: true,
                    },
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
            // new webpack.optimize.CommonsChunkPlugin({
            //     name: "commons",
            //     minChunks: Infinity,
            // }),

            new CopyWebpackPlugin(
                [
                    {
                        from: "source/client/assets",
                        to: "assets",
                    },
                ],
                {},
            ),
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
