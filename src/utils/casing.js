export default class Casing {

    /**
     * convert to camelCase
     * @param {string} str
     * @returns
     */
    static toCamel(str) {
        return str.trim().toLowerCase().replace(/(_\w)/g, (match) => match.toUpperCase().substr(1));
    }
    /**
     * convert to snake_case
     * @param {string} str
     */
    static toSnake(str) {
        return str.trim().replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    }

    /**
     * convert the object's key names to camelCase
     * @param {Object} obj object
     */
    static toCamelkeys(obj) {
        const keys = Object.keys(obj);

        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            const camelCaseKey = this.toCamel(key);
            if (camelCaseKey !== key) {
                obj[camelCaseKey] = obj[key];
                delete obj[key];
            }
        }
    }
}
