const ApiError = require('../Error/errorApi');
const { Type } = require('../model');


class TypeController {
    async create(req, res, next) {
        try {
            console.log('Received request to create type');
            const {name} = req.body;
            if (!name) {
                return next(ApiError.badRequest('Name is missing'));
            }
            const type = await Type.create({name});
            console.log('Type created successfully:', type);
            return res.json(type);
        } catch (error) {
            console.error('Error creating type:', error);
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            console.log('Received request to get all types');
            const types = await Type.findAll();
            console.log('Types fetched successfully:', types);
            return res.json(types);
        } catch (error) {
            console.error('Error getting all types:', error);
            next(error);
        }
    }
}

module.exports = new TypeController();
