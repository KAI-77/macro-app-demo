import {body, validationResult} from "express-validator";


export const validateRegistration = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .bail()
        .isString().withMessage('Name must be a string')
        .bail()
        .matches(/^[a-zA-Z][a-zA-Z0-9 ]*$/).withMessage('Name must start with a letter'),
    body('email')
        .exists().withMessage('Email field is required')
        .notEmpty().withMessage('Email is required')
        .matches(/^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/)
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),



    body('password').not().isEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number') // Require at least one number
        .matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/).withMessage('Password must contain at least one special character'), //  Require at least one special character
    body('confirmPassword').notEmpty().withMessage('Confirm Password is Required').bail().custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')
];


export const validateLogin = [
    body('email')
        .exists().withMessage('Email field is required')
        .notEmpty().withMessage('Email is required')
        .matches(/^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/)
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
    body('password').not().isEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number') // Require at least one number
        .matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/).withMessage('Password must contain at least one special character'), //  Require at least one special character
]

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
}