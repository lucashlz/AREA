module.exports = {
    preset: "react-native",
    setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
    transform: {
      "^.+\\.(js|jsx)$": "<rootDir>/front/mobileapp/node_modules/babel-jest",
      "\\.(ts|tsx)$": "ts-jest",
    },
    moduleFileExtensions: ["js", "jsx", "json", "node", "ts", "tsx"],
    moduleNameMapper: {
      "^.+\\.(ttf|otf)$": "<rootDir>/front/mobileapp/__mocks__/fileMock.js",
    },
  };