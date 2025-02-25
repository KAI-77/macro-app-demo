import {body, validationResult} from "express-validator";


export const validateRegistration = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number') // Require at least one number
        .matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/).withMessage('Password must contain at least one special character'), //  Require at least one special character
    body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')
];


export const validateLogin = [
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
]

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
}