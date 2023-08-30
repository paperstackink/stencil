module.exports = {
    transform: {
        '^.+\\.js$': 'esbuild-jest',
        '^.+\\.stencil$': 'jest-text-transformer',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transformIgnorePatterns: [],
    setupFilesAfterEnv: ['jest-extended/all'],
}
