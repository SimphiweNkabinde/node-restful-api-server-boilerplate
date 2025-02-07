class Casing {

    /**
     * convert to camelCase
     * @param {string} str 
     * @returns 
     */
    static toCamel(str) {
        return str.trim().toLowerCase().replace(/(_\w)/g, m => m.toUpperCase().substr(1));
    }
    /**
     * convert to snake_case
     * @param {string} str 
     */
    static toSnake(str) {
        return str.trim().replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    }
}

module.exports = Casing