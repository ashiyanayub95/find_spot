const {body, validationResult} = require("express-validator");


async function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

const registerValidationRules = () => {
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('phone_numnber').optional().isMobilePhone().withMessage('Valid phone number is required'),
        validateRequest
};

const loginValidationRules = () => {
        body('email').optional().isEmail().withMessage('Valid email is required'),
        body('username').optional().notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required'),
        validateRequest
};

module.exports = {
    validateRequest,
    registerValidationRules,
    loginValidationRules
};