import { body } from "express-validator"
import userModel from "../models/users-model.js"


export const loginValidator = [
    body('email')
        .trim()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email format'),
    
    body('password')
        .trim()
        .notEmpty()
        .isLength({ min: 7 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
        .withMessage('Password must be at least 7 characters long, contain one lowercase letter, one uppercase letter, and one special character')
]

export const registerValidator = [
    body("fullname")
        .trim()
        .notEmpty()
        .withMessage("Fullname must be at least 3 characters long"),
    body("email")
        .trim()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .custom(value=> {
            try {
                const user =  userModel.findOne({email:value})
                if(user){
                    return Promise.reject("Email already in use")
                }
                return true
            } catch (error) {
                throw error;
            }
        })
        .withMessage("Invalid email format"),
    body("phone")
        .trim()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 10 })
        .custom(value=> {
            try {
                const user =  userModel.findOne({phone:value})
                if(user){
                    return Promise.reject("Phone Number already in use")
                }
                return true
            } catch (error) {
                throw error;
            }
        })
        .withMessage("Phone number must be at least 10 digits long"),
    body("password")
        .trim()
        .notEmpty()
        .isLength({ min: 7 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
        .withMessage("Password must be at least 7 characters long, contain one lowercase letter, one uppercase letter, and one special character"),    
]