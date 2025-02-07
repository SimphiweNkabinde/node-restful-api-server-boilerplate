import { expect } from "chai"
import Casing from "../src/utils/casing.js";

describe('utils: casing', () => {
    it('should convert snake_case string to camelCase string', () => {
    
        const snakeCase = "hello_world";
        const resultString = Casing.toCamel(snakeCase);
        expect(resultString).to.equal('helloWorld');
    })

    it('should convert camelCase string to snake_case string', () => {
    
        const snakeCase = "helloWorld";
        const resultString = Casing.toSnake(snakeCase);
        expect(resultString).to.equal('hello_world');
    })
})
