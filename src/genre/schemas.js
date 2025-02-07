const { object, string } = require('yup');


const create = object({
    name: string().trim().min(2).lowercase().required()
})

const update = object({
    name: string().trim().min(2).lowercase().required()
})

module.exports = {
    create,
    update
}