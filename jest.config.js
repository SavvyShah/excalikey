module.exports = {
  preset: "vite-jest",
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}",
  ],
  moduleNameMapper: {
    "\\.(css|sass|scss)$": "identity-obj-proxy",
  },
};
