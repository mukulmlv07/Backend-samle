const { Router } = require('express')

const { isAuthenticate } = require('../common/helpers/auth')
const {
    signup, 
    reSendCode,
    login, 
    logout, 
    updateUser,
    getUser,
    verifyEmail, 
    resetPassword
} = require('../controllers')

const {
    validateVerifyEmail,
    validateLogin,
    validateResetPass
} = require('../common/validators')

const routes = Router()

routes.post('/register', signup) 
routes.post('/resend', reSendCode)
routes.post('/login', validateLogin, login)
routes.post('/logout', isAuthenticate, logout)
routes.post('/user/details', isAuthenticate, getUser)
routes.post('/user/update', isAuthenticate, updateUser)
// routes.post('/verify-user',isAuthenticate,async(req,res)=> {
//     // console.log(req.body);
//     const r = await validateUser(req.body.token,req.body.username);
//     res.json({
//         msg:r,
//         res:'success'
//     })
// })
routes.post('/email/verify', validateVerifyEmail, verifyEmail)
routes.post('/password/reset', validateResetPass, resetPassword)

module.exports = routes
