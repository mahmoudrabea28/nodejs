import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

/**
 * Define schemas with Joi.
 * This is only used to valdiation the required fields.
 */
const schemas: Record<string, Joi.ObjectSchema> = {
    // certification fields
    certification: Joi.object({
        certificateName: Joi.string().required().messages({
            'string.base': '"Certificate Name" must be a string',
            'string.empty': '"Certificate Name" cannot be empty',
            'any.required': '"Certificate Name" is required',
        }),
        design: Joi.string().required().messages({
            'string.base': '"Design" must be a string',
            'string.empty': '"Design" cannot be empty',
            'any.required': '"Design" is required',
        }),
        issuer: Joi.string().required().messages({
            'string.base': '"Issuer" must be a string',
            'string.empty': '"Issuer" cannot be empty',
            'any.required': '"Issuer" is required',
        }),
        groups: Joi.array().items(Joi.string()).required().messages({
            'array.base': '"Groups" must be an array',
            'array.empty': '"Groups" cannot be empty',
            'any.required': '"Groups" is required',
        }),
    }),

    // this is for approver fields
    approver: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': '"Email" must be a valid email address',
            'string.empty': '"Email" cannot be empty',
            'any.required': '"Email" is required',
        }),
    }),

    // this is for group fields
    group: Joi.object({
        name: Joi.string().required().messages({
            'string.base': '"Name" must be a string',
            'string.empty': '"Name" cannot be empty',
            'any.required': '"Name" is required',
        }),
    }),

    // this is for member required fields
    member: Joi.object({
        name: Joi.string().required().messages({
            'string.base': '"Name" must be a string',
            'string.empty': '"Name" cannot be empty',
            'any.required': '"Name" is required',
        }),
        email: Joi.string().email().required().messages({
            'string.email': '"Email" must be a valid email address',
            'string.empty': '"Email" cannot be empty',
            'any.required': '"Email" is required',
        }),
        groupId: Joi.string().required().messages({
            'string.base': '"Group ID" must be a string',
            'string.empty': '"Group ID" cannot be empty',
            'any.required': '"Group ID" is required',
        }),
        groupName: Joi.string().required().messages({
            'string.base': '"Group Name" must be a string',
            'string.empty': '"Group Name" cannot be empty',
            'any.required': '"Group Name" is required',
        }),
    }),
};

/**
 * Validation middleware for dynamic model.
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
function validateModel(req: Request, res: Response, next: NextFunction): void | Response {
    const modelName = req.params.model; // get model name from route parameter
    const schema = schemas[modelName];

    if (!schema) {
        return res.status(400).json({ message: 'Invalid model type' });
    }

    // Validate request body against the model's schema.
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((err) => ({
            field: err.context?.label || 'unknown',
            message: err.message.replace(/\"/g, ''), // remove quotes from error messages
        }));
        return res.status(400).json({ errors });
    }

    next(); // Proceed to the next middleware or route handler if validation passes.
}

export default validateModel;
