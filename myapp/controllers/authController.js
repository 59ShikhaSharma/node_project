// exports.login = async function (req,res,next){
//     try {
//         const user = {
//             id: 1,
//             username: "Shikha",
//             email: "abc@gmail.com"
//         }
//         jwt.sign({ user }, secretKey, { expiresIn: '300s' }, (err, token) => {
//             res.json({
//                 token
//             })
    
//         })

    
//     } catch (error) {

        
        
//     }

// }

// exports.signup = async function (req,res,next){
//     try {
//         jwt.verify(req.token, secretKey, (err, authData) => {
//             if (err) {
//                 res.send({ result: "Invalid Token" })
//             } else {
//                 res.json({
//                     message: "profile accessed",
//                     authData
//                 })
//             }
//         })
    
//     } catch (error) {
        
        
//     }

// }


// var createError = require('http-errors');
// var validator = require('validator')
// var crypto = require('crypto')

// var Email = require('../utils/email')
// var { createUser, getUserByUseremail } = require('../model/userModel')
// var jwt = require('jsonwebtoken')

// async function isPasswordCorrect(candiatePassword, userPassword) {
//     let c= crypto.hash('sha256',candiatePassword,'hex')
//     return c===userPassword
// }

// async function createAndSendToken(user, statusCode, res) {
//     let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' })

//     const cookieOptions = {
//         expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
//         httpOnly: true,
//     }

//     if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

//     res.cookie('jwt', token, cookieOptions)

//     user.password = undefined

//     res.status(statusCode).json({
//         status: "success",
//         data: {
//             user
//         }
//     })
// }

// exports.signUp = async function (req, res, next) {
//     let { username, email, password } = req.body

//     if (!username) {
//         return next(new Error('Enter a username'))
//     }

//     if (!email) {
//         return next(new Error('Enter a email'))
//     }

//     if (!password) {
//         return next(new Error('Enter a password'))
//     }

//     if (!validator.isAlphanumeric(username) || !validator.isLength(username, { min: 3, max: 30 })) {
//         return res.status(400).json({ error: 'Username must be alphanumeric and between 3 to 30 characters long' });
//     }

//     if (!validator.isEmail(email)) {
//         return res.status(400).json({ error: 'Please enter a valid email address' });
//     }

//     if (!validator.isLength(password, { min: 6 })) {
//         return res.status(400).json({ error: 'Password must be at least 6 characters long' });
//     }


//     if (await getUserByUseremail(email)) {
//         return res.status(400).json({ error: 'User already exists. Please login' });
//     }

//     password=crypto.hash("sha256",password,"hex");

//     try {
//         const newUser = await createUser(username, email, password);
//         await new Email(newUser).sendWelcome('Welocme to our family I hope you will enjoy')
//         createAndSendToken(newUser, 201, res)
//     } catch (err) {
//         console.error('Error signing up:', err.message);
//         res.status(500).json({ error: 'Failed to sign up' });
//     }

// }

// exports.login = async function (req, res, next) {
//     const { email, password } = req.body

//     if (!email || !password) {
//         return next(new Error('Enter a valid email and password'))
//     }

//     const user = await getUserByUseremail(email)


//     if (!user || !await isPasswordCorrect(password, user.password)) {
//         return next(new Error('Invalid email and password'))
//     }

//     createAndSendToken(user, 200, res)
// }

const createError = require('http-errors');
const validator = require('validator');
const crypto = require('crypto');

const Email = require('../utils/email');
const { createUser, getUserByUseremail } = require('../model/userModel');
const jwt = require('jsonwebtoken');

async function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

async function isPasswordCorrect(candidatePassword, userPassword) {
    const hashedCandidatePassword = await hashPassword(candidatePassword);
    return hashedCandidatePassword === userPassword;
}

async function createAndSendToken(user, statusCode, res) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    

    res.status(statusCode).json({
        status: "success",
        data: {
            user
        }
    });
}

exports.signUp = async function (req, res, next) {
    let { username, email, password } = req.body;

    if (!username) {
        return next(new Error('Enter a username'));
    }

    if (!email) {
        return next(new Error('Enter an email'));
    }

    if (!password) {
        return next(new Error('Enter a password'));
    }

    if (!validator.isAlphanumeric(username) || !validator.isLength(username, { min: 3, max: 30 })) {
        return res.status(400).json({ error: 'Username must be alphanumeric and between 3 to 30 characters long' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    if (!validator.isLength(password, { min: 6 })) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    if (await getUserByUseremail(email)) {
        return res.status(400).json({ error: 'User already exists. Please login' });
    }

    try {
        const hashedPassword = await hashPassword(password);
        const newUser = await createUser(username, email, hashedPassword);
        await new Email(newUser).sendWelcome('Welcome to our family. We hope you will enjoy!');
        createAndSendToken(newUser, 201, res);
    } catch (err) {
        console.error('Error signing up:', err.message);
        res.status(500).json({ error: 'Failed to sign up' });
    }
};

exports.login = async function (req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new Error('Enter a valid email and password'));
    }

    const user = await getUserByUseremail(email);

    if (!user || !(await isPasswordCorrect(password, user.password))) {
        return next(new Error('Invalid email and password'));
    }

    createAndSendToken(user, 200, res);
};

