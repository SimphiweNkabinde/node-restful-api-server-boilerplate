const { boolean, number, object, string } = require('yup');


const create = object({
    name: string().required(),
    genre: string().required(),
    rating: number().required().min(1).max(10),
    explicit: boolean().required()
})

const update = object({
    name: string(),
    genre: string(),
    rating: number().min(1).max(10),
    explicit: boolean()
})

module.exports = {
    create,
    update
}