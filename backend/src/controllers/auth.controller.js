const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/balcklist.model")


/**
 * @name registerUerController
 * @description Register a new user, expects user name , email , and password in the user body
 * @access Public 
 */

async function registerUerController(req, res) {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    })


    if (isUserAlreadyExists) {

        if (isUserAlreadyExists.username === username) {
            return res.status(400).json({
                message: "Account already exists with this username",
            })
        }
        return res.status(400).json({
            message: "Account already exists with this email",
        })


    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash,
    });

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            success: false,
            message: 'Server configuration error: JWT secret is not set',
        });
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie('token', token);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    });


}

/**
 * @name loginUserController
 * @description Login a user, expects email and password in the user body
 * @access Public 0
 */

async function loginUserController(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({

            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            success: false,
            message: 'Server configuration error: JWT secret is not set',
        });
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie('token', token);
    res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    });

}



/**
 * @name logoutUserController
 * @description clear token from user cookie and add token in the blacklist
 * @access Public 
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.create({ token })

    }
    res.clearCookie("token")

    res.status(200).json({
        message: "user logged out successfully"
    })
}

/**
 *@name getMeController
 * @description get user details of the logged in user
 * @access Private
 */
async function getMeController(req, res) {

    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    })

}


module.exports = {
    registerUerController,
    loginUserController,
    logoutUserController,
    getMeController
} 