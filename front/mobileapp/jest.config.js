module.exports = {
    preset: "react-native",
    setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
    transform: {
      "^.+\\.(js|jsx)$": "<rootDir>/node_modules/babel-jest",
    },
    moduleFileExtensions: ["js", "jsx", "json", "node", "ts", "tsx"],
    moduleNameMapper: {
      "^.+\\.(ttf|otf)$": "<rootDir>/__mocks__/fileMock.js",
    },
  };