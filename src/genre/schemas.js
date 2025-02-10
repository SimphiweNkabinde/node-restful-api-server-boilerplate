import { object, string } from 'yup';


const create = object({
    name: string().trim().min(2).lowercase().required()
})

const update = object({
    name: string().trim().min(2).lowercase().required()
})

export {
    create,
    update
}