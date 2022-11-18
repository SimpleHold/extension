// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
    moduleNameMapper: {
        "@src/(.*)": "<rootDir>/src/$1",
    },
    roots: ["<rootDir>/src"],
    testPathIgnorePatterns: ["/node_modules/", "stories.tsx"],
    transform: {
        "\\.tsx?$": "ts-jest",
    },
};
