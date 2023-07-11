const { isEmpty } = require('lodash')
const { User } = require('../../db/models')
// const otpGenerator = require('otp-generator')
const { genJWTToken, removeToken } = require('../common/helpers/auth')

const logger = require('../common/helpers/logger')
const { STATUS_CODE } = require('../common/helpers/response-code')
const { Response, systemError } = require('../common/response-formatter')
// const sendEmail = require('../common/helpers/email')
const { encrypt, decrypt } = require('../common/helpers/crypto')
const {
    SIGNUP,
    LOGIN,
    LOGOUT,
    VERIFY_STATUS,
    TYPE_LOG,
    USER,
    AUTHENTICATION
} = require('../common/helpers/constant')

const USER_TOKEN_EXPIRED = 60 * 60 * 24 * 30; // eixpres in seconds

// const signup = async (req, res) => {  
//     const {
//         fullName,
//         email,
//         password,
//         universityName
//     } = req.body

//     let isSendEmail = false

//     let response = Response(STATUS_CODE.SUCCESS, SIGNUP.SUCCESS, '')
//     const pinCode = otpGenerator.generate(6, { specialChars: false })
//     let validEmail = email.split('+')[0]
//     validEmail = validEmail === email ? validEmail : validEmail + '@' + email.split('@')[1]
//     try {
//         const existedUser = await User.findOne({ email: `${validEmail}` })
//         console.log(existedUser)
//         if (isEmpty(existedUser)) {
//             const userData = {
//                 full_name: `${fullName}`,
//                 email: `${validEmail.toLocaleLowerCase()}`,
//                 code: pinCode,
//                 email_status: VERIFY_STATUS.UNVERIFIED,
//                 password: encrypt(password),
//                 university_name: universityName,
//                 expired_at: Date.now()
//             }
//             await User.create(userData)
//             isSendEmail = true
//         } else if (existedUser.email_status === VERIFY_STATUS.UNVERIFIED) {
//             await User.findOneAndUpdate({ email: `${validEmail}` }, 
//                 { code: pinCode, expired_at: Date.now() })
         
//             isSendEmail = true
//         } else {
//             response.statusCode = STATUS_CODE.EXISTED_VALUE
//             response.message = `${SIGNUP.EMAIL_EXIST}`
//         }

//         if (isSendEmail) {
//             const emailParams = {
//                 name: fullName,
//                 info: pinCode
//             }
//             await sendEmail(email.toLocaleLowerCase(),
//                 emailParams, 'email_verification', 'Confirm your Platform account!')
//         }
//     } catch (err) {
//         logger.error(TYPE_LOG.USER, 'Exeption, user cannot signup: ', err.stack)
//         response = systemError(SIGNUP.EXCEPTION)
//     }
//     res.send(response)
// }

// /**
//  * Resend a `passcode` for verify account
//  * @param {*} req: in body, pass through (email, first_name, last_name)
//  * @param {*} res: Return error code as API's document
//  */
// const reSendCode = async (req, res) => {
//     const pinCode = otpGenerator.generate(6, { specialChars: false })
   
//     const { 
//         email,
//         isSignup
//     } = req.body

//     let response = Response(STATUS_CODE.SUCCESS, SIGNUP.RESEND_CODE, { email: `${email}` })
//     try {
//         const existedUser = await User.findOne({ email: `${email.toLocaleLowerCase()}` })
//         if (!isEmpty(existedUser)) {
//             await User.findOneAndUpdate({ email: `${email.toLocaleLowerCase()}` }, { code: pinCode, expired_at: Date.now() })
//             const emailParams = {
//                 name: existedUser.account_name,
//                 info: pinCode
//             }
//             if (isSignup) {
//                 await sendEmail(email.toLocaleLowerCase(),
//                     emailParams, 'email_verification', 'Confirm your Platform account!')
//             } else {
//                 response.message = SIGNUP.RESEND_PWD
//                 await sendEmail(email.toLocaleLowerCase(),
//                     emailParams, 'reset_password', 'Reset your Platform password!')
//             }
//         } else {
//             response.statusCode = STATUS_CODE.NOT_FOUND
//             response.message = SIGNUP.USER_NOT_EXIST
//         }
//     } catch (err) {
//         logger.error(TYPE_LOG.USER, ' Cannot resend PIN code for user: ', err.stack)
//         response = systemError(SIGNUP.EXCEPTION)
//     }
//     res.send(response)
// }

/**
 * User login API
 * @param {*} req: in body, pass through (email, password)
 * @param {*} res: if login is successful, return user's info and token
 *                 otherwise return error code as API's document
 */
const login = async (req, res) => {
    const { 
        email,
        password
    } = req.body
    let response = Response(STATUS_CODE.SUCCESS, LOGIN.SUCCESS, '')
    try {
        const existedUser = await User.findOne({ email: `${email}` })

        console.log(existedUser)
        if (isEmpty(existedUser)) {
            response.statusCode = STATUS_CODE.NOT_FOUND
            response.message = LOGIN.INVALID_EMAIL
        }
        // else if (existedUser.email_status === VERIFY_STATUS.UNVERIFIED) {
        //     response.statusCode = STATUS_CODE.UNVERIFIED_EMAIL
        //     response.message = LOGIN.UNVERIFIED_MAIL
        // } 
        else if (password !== existedUser.password) {
            response.statusCode = STATUS_CODE.INVALID_VALUE
            response.message = LOGIN.WRONG_PASS_EMAIL
        } else {
            const token = await genJWTToken(`${existedUser._id}`, USER_TOKEN_EXPIRED)
            let userInfo = {
                userId: existedUser._id,
                fullName: existedUser.full_name,
                email: existedUser.email
            }

            response.data = {
                user: userInfo,
                token: token
            }
        }
    } catch (err) {
        logger.error(TYPE_LOG.USER, 'User cannot login: ', err.stack)
        response = systemError(LOGIN.EXCEPTION)
    } 
    res.send(response)
}

// const logout = async (req, res) => {
//     let response = Response(STATUS_CODE.SUCCESS, LOGOUT.SUCCESS, '')
//     const token = req.headers.authorization.split(' ')[1]
//     try {
//         await removeToken(token)
//     } catch (err) {
//         logger.error(TYPE_LOG.USER, 'User cannot logout: ', err.stack)
//         response = systemError(LOGOUT.EXCEPTION)
//     }
//     res.send(response)
// }

// const updateUser = async (req, res) => {
//     let {
//         userOwn,
//         userId,
//         address,
//         bio,
//         specialization,
//         skills,
//         interest,
//         isCollegeStudent,
//         isTechEmployee,
//         social,
//         universityDetails
//     } = req.body
//     let response = Response(STATUS_CODE.SUCCESS, USER.UPDATED, '')
//     try {
//         if (userOwn !== userId) {
//             response.statusCode = STATUS_CODE.UNAUTHORIZATION
//             response.message = AUTHENTICATION.UNAUTHORIZED
//         } else {
//             const existedUser = await User.findById(userId)
//             if (isEmpty(existedUser)) {
//                 response.statusCode = STATUS_CODE.NOT_FOUND
//                 response.message = USER.NOT_EXIST
//             } else {
//                 address = address || existedUser.address
//                 bio = bio || existedUser.bio
//                 specialization = specialization || existedUser.specialization
//                 skills = skills || existedUser.skills
//                 interest = interest || existedUser.interest
//                 isCollegeStudent = isCollegeStudent || existedUser.is_college_student
//                 isTechEmployee = isTechEmployee || existedUser.is_tech_employee
//                 social = JSON.parse(social) || existedUser.social
//                 universityDetails = JSON.parse(universityDetails) || existedUser.universityDetails
//                 await User.findByIdAndUpdate({ _id: userId }, {
//                     $set: {
//                         address: address,
//                         bio: bio,
//                         specialization: specialization,
//                         skills: skills,
//                         interest: interest,
//                         is_college_student: isCollegeStudent,
//                         is_tech_employee: isTechEmployee,
//                         social: social,
//                         universityDetails: universityDetails
//                     }
//                 })
//             }
//         }
//     } catch (err) {
//         logger.error(TYPE_LOG.USER, 'Exception: Failed to update user profile ', err.stack)
//         response = systemError(USER.EXCEPTION)
//     }
//     res.send(response)
// }

// const getUser = async (req, res) => {
//     const {
//         userOwn,
//         userId
//     } = req.body

//     let response = Response(STATUS_CODE.SUCCESS, USER.SUCCESS, '')
//     try {
//         if (userOwn !== userId) {
//             response.statusCode = STATUS_CODE.UNAUTHORIZATION
//             response.message = AUTHENTICATION.UNAUTHORIZED
//         } else {
//             const user = await User.findById(userId)
//             if (isEmpty(user)) {
//                 response.statusCode = STATUS_CODE.NOT_FOUND
//                 response.message = USER.NOT_EXIST
//             } else {
//                 response.data = {
//                     userId: user._id,
//                     fullName: user.full_name,
//                     email: user.email,
//                     profilePicture: user.profile_picture,
//                     address: user.address,
//                     bio: user.bio,
//                     specialization: user.specialization,
//                     skills: user.skills,
//                     interest: user.interest,
//                     isCollegeStudent: user.is_college_student,
//                     isTechEmployee: user.is_tech_employee,
//                     social: user.social,
//                     universityDetails: user.university_details,
//                     totalProjectCount: user.total_project_count,
//                     approvedProjectCount: user.approved_project_count,
//                     likedProject: user.liked_project,
//                     savedProject: user.saved_project
//                 }
//             }
//         }
//     } catch (err) {
//         logger.error(TYPE_LOG.USER, 'Exception: Failed to fetch user profile ', err.stack)
//         response = systemError(USER.EXCEPTION)
//     }
//     res.send(response)
// }

module.exports = {
    // signup,
    login,
    // logout,
    // reSendCode,
    // updateUser,
    // getUser
}
