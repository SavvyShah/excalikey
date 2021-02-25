module.exports = {
  transform: {
    "\\.[jt]sx?$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js",
    //webpack aliases
    "^roughjs$": "<rootDir>/node_modules/roughjs/bundled/rough.esm.js`"
  }
};
