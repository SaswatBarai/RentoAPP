import { body } from "express-validator"
import userModel from "../models/users-model.js"


export const loginValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
]

export const registerValidator = [
    body("fullname")
        .trim()
        .notEmpty()
        .withMessage("Fullname is required"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail()
        .custom(async value => {
            const user = await userModel.findOne({email: value});
            if(user) {
                throw new Error("Email already in use");
            }
            return true;
        }),
    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .isNumeric()
        .withMessage("Phone number must be numeric")
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone number must be exactly 10 digits")
        .custom(async value => {
            const user = await userModel.findOne({phone: value});
            if(user) {
                throw new Error("Phone Number already in use");
            }
            return true;
        }),
 body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom((value) => {
        // Create proper RegExp objects for each requirement
        const hasLowercase = /[a-z]/.test(value);
        const hasUppercase = /[A-Z]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
        // Check if all requirements are met
        if (!hasLowercase || !hasUppercase || !hasSpecialChar) {
            return false;
        }
        return true;
    })
    .withMessage("Password must contain one lowercase letter, one uppercase letter, and one special character")
    .custom(value => {
        console.log("Password passed validation:", value);
        return true;
    }),
]