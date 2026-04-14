const {Router}= require('express')
const authController = require("../controllers/auth.controller")
const authMiddleware =require("../middlewares/auth.middleware")

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description REgister a new user 
 * @access public 
 * 
 */

authRouter.post("/register", authController.registerUerController)

  
/**
 * @route POST  /api/auth/login
 * @description- login user with email and password
 * @access public 
 * 
 */

authRouter.post("/login", authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add token in the blacklist
 * @access public 
 
 */


authRouter.get("/logout", authController.logoutUserController)

/**
 * @route GET/api/auth/getme
 * @description get user details of the logged in user, expects token in the cookie
 * @access private
 */

authRouter.get("/get-me",authMiddleware.authUser, authController.getMeController)


module.exports= authRouter