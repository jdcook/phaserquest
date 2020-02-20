const path = require("path");

module.exports = {
    entry: "./src/main.ts",
    output: {
        path: path.resolve(__dirname, ""),
        filename: "phaserquest-bundle.js",
    },
    resolve: {
        extensions: [".ts", ".js", ".json"],
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.(tsx?)$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {},
            },
            {
                test: /\.(tsx?)$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                },
            },
        ],
    },
};
