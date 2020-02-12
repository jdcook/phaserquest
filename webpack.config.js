const path = require("path");

module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, ""),
        filename: "phaserquest-bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};
