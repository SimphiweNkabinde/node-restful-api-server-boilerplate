import globals from 'globals';
import pluginJs from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    {
        plugins: { '@stylistic/js': stylisticJs },
        rules: {
            // REFERENCES
            'no-var': 'error',
            'prefer-const': 'error',
            // OBJECTS
            'object-shorthand': 'error',
            '@stylistic/js/object-curly-newline': ['error', { 'multiline': true }],
            // DESTRUCTURING
            'prefer-destructuring': 'error',
            // STRINGS
            '@stylistic/js/quotes': ['error', 'single'],
            'prefer-template': ['error'],
            '@stylistic/js/template-curly-spacing': ['error', 'never'],
            'no-useless-escape': ['error'],
            // FUNCTIONS
            'no-loop-func': ['error'],
            'prefer-rest-params': ['error'],
            'default-param-last': ['error'],
            'space-before-function-paren': ['error', 'never'],
            '@stylistic/js/space-before-blocks': ['error', 'always'],
            'no-param-reassign': 'error',
            'prefer-spread': 'error',
            '@stylistic/js/function-paren-newline': ['error', 'multiline'],
            'prefer-arrow-callback': 'error',
            '@stylistic/js/arrow-spacing': 'error',
            '@stylistic/js/arrow-parens': ['error', 'always'],
            'arrow-body-style': ['error', 'as-needed'],
            '@stylistic/js/no-confusing-arrow': 'error',
            '@stylistic/js/implicit-arrow-linebreak': ['error', 'beside'],
            // VARIABLES
            'no-undef': 'warn',
            'one-var': ['error', 'never'],
            'no-multi-assign': 'error',
            '@stylistic/js/operator-linebreak': ['error', 'after'],
            'no-unused-vars': 'error',
            'no-use-before-define': 'off',
            // COMPARISON OPERATORS & EQUALITY
            'eqeqeq': 'error',
            'no-case-declarations': 'error',
            'no-nested-ternary': 'error',
            'no-unneeded-ternary': 'error',
            '@stylistic/js/no-mixed-operators': 'error',
            // Blocks
            '@stylistic/js/nonblock-statement-body-position': ['error', 'beside'],
            '@stylistic/js/brace-style': 'error',
            'no-else-return': 'error',
            // Comments
            '@stylistic/js/spaced-comment': ['error', 'always'],
            // Whitespace
            '@stylistic/js/indent': ['error'],
            '@stylistic/js/keyword-spacing': 'error',
            '@stylistic/js/space-infix-ops': 'error',
            '@stylistic/js/eol-last': [
                'error',
                'always',
            ],
            '@stylistic/js/no-whitespace-before-property': 'error',
            '@stylistic/js/no-multiple-empty-lines': 'error',
            '@stylistic/js/space-in-parens': ['error', 'never'],
            '@stylistic/js/array-bracket-spacing': ['error', 'never'],
            '@stylistic/js/object-curly-spacing': ['error', 'always'],
            '@stylistic/js/comma-spacing': ['error', {  'before': false, 'after': true }],
            '@stylistic/js/computed-property-spacing': ['error', 'never'],
            '@stylistic/js/function-call-spacing': ['error',  'never'],
            '@stylistic/js/key-spacing': ['error', { 'beforeColon': false }],
            '@stylistic/js/no-trailing-spaces': 'error',
            '@stylistic/js/comma-style': ['error',  'last'],
            '@stylistic/js/comma-dangle': ['error', 'always-multiline'],
            // Semicolons
            'no-new-wrappers': 'error',
            '@stylistic/js/semi': ['error', 'always'],
            // Naming Conventions
            'id-length': 'error',
        },
    },
];
