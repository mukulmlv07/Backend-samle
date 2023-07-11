const {
    checkSchema,
    validationResult
} = require('express-validator')
const rules = require('./rules')

const prepareCustomErrorMessage = (errors) => {
    const errorDetails = errors.map(({ param, msg }) => {
        return { param, msg }
    })
    return {
        name: 'ValidationError',
        status: 422,
        message: errorDetails
    }
}

const validate = async (req, res, next) => {
    const errorResult = validationResult(req).array()
    if (errorResult.length > 0) {
        const errors = prepareCustomErrorMessage(errorResult)
        res.status(422).send({ errors })
    } else {
        next()
    }
}

const validateSignup = [checkSchema(rules.signup), validate]
const validateLogin = [checkSchema(rules.login), validate]
const validateVerifyEmail = [checkSchema(rules.verifyEmail), validate]
const validateResetPass = [checkSchema(rules.resetPassword), validate]
const validateProject = [checkSchema(rules.project), validate]
const validateGetUserAllProject = [checkSchema(rules.getUserAllProjects), validate]
const validateGetProjectByStatus = [checkSchema(rules.getProjectsByStatus), validate]
const validatelikeProject = [checkSchema(rules.likeProject), validate]
module.exports = {
    validateSignup,
    validateLogin,
    validateVerifyEmail,
    validateResetPass,
    validateProject,
    validateGetUserAllProject,
    validateGetProjectByStatus,
    validatelikeProject
}
