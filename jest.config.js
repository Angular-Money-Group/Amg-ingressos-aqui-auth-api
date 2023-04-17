export default {
    testEnvironment: "node",
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.json",
        isolatedModules: true
      }
    },
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    testMatch: ["**/*.spec.ts"]
  };
  