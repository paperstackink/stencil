module.exports = {
    transform: {
        '^.+\\.js$': 'esbuild-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transformIgnorePatterns: [],
}
