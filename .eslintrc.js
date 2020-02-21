module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    extends: [
        "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        "plugin:prettier/recommended",
    ],
    plugins: ["prettier"],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module", // Allows for the use of imports
    },
    rules: {
        "@typescript-eslint/no-inferrable-types": "off",
        "spaced-comment": "warn",
        curly: "warn",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
        "@typescript-eslint/no-magic-numbers": [
            "warn",
            {
                ignore: [0, 2, 0.5],
                ignoreNumericLiteralTypes: true,
                ignoreReadonlyClassProperties: true,
                ignoreEnums: true,
                ignoreArrayIndexes: true,
            },
        ],
    },
};
