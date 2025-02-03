const { boolean, number, object, string } = require('yup');


const create = object({
    name: string().trim().min(2).required(),
    genre: string().trim().min(2).required(),
    rating: number().min(1).max(10).required(),
    explicit: boolean().required()
})

const update = object({
    name: string().trim().min(2),
    genre: string().trim().min(2),
    rating: number().min(1).max(10),
    explicit: boolean()
})

module.exports = {
    create,
    update
}