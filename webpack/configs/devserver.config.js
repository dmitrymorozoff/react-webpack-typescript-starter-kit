module.exports = () => ({
    devServer: {
        port: 8080,
        host: "localhost",
        open: true,
        compress: true,
        stats: "errors-only",
    },
});
