const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = paths => {
    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    include: paths,
                    use: ExtractTextPlugin.extract({
                        publicPath: "../dist",
                        fallback: "style-loader",
                        use: ["css-loader", "sass-loader"],
                    }),
                },
                {
                    test: /\.css$/,
                    include: paths,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: "css-loader",
                    }),
                },
            ],
        },
        plugins: [new ExtractTextPlugin("./css/[name].css")],
    };
};
