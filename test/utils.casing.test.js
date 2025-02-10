import { expect } from 'chai';
import Casing from '../src/utils/casing.js';
import { describe, it } from 'mocha';

describe('utils: casing', () => {
    it('should convert snake_case string to camelCase string', () => {

        const snakeCase = 'hello_world';
        const resultString = Casing.toCamel(snakeCase);
        expect(resultString).to.equal('helloWorld');
    });

    it('should convert camelCase string to snake_case string', () => {

        const snakeCase = 'helloWorld';
        const resultString = Casing.toSnake(snakeCase);
        expect(resultString).to.equal('hello_world');
    });

    it('should convert an object\'s snake_case key names to camelCase names', () => {

        const snakeCaseObject = {
            one_two: 'one two',
            three_and_four_and_five: 'three four five',
            this_snake_case_name_is_long: 'this snake case name is long',
        };
        Casing.toCamelkeys(snakeCaseObject);
        expect(snakeCaseObject).to.include.keys('oneTwo', 'threeAndFourAndFive', 'thisSnakeCaseNameIsLong');
    });
});
