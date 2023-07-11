const jwt = require('jsonwebtoken')
const { isEmpty } = require('lodash')
const { Response } = require('../response-formatter')
const { STATUS_CODE } = require('../helpers/response-code')
const { AUTHENTICATION } = require('../helpers/constant')
const { User } = require('../../../db/models')
const { redisClient } = require('./redisClient')
const { decrypt } = require('./crypto')

const authenticationToken = 'AwerT$&*123PoqweCv'

const validateUser = async (token, userId) => {
    let isExist = await redisClient.getAsync(`${token}`)
    // console.log(isExist,'validate $$$$')
    if (isExist) {
        const isUser = await User.findById(userId)
        isExist = !isEmpty(isUser)
    }
    return isExist
}

const removeToken = async (token) => {
    await redisClient.del(token)
}

const genJWTToken = async (userId, expTime) => {
    const token = jwt.sign({ id: userId }, authenticationToken, {
        expiresIn: expTime // expires in 30 mins 
    })
    await redisClient.setAsync(token, userId)
    // let isExist = await redisClient.getAsync(`${token}`)
    // console.log(isExist, 'validate $$$$')
    redisClient.expire(token, expTime)
    return token
}

const isAuthenticate = async (req, res, next) => {
    let response = Response(STATUS_CODE.SUCCESS, AUTHENTICATION.SUCCESS, false, '')

    try {
        const token = req.header('Authorization').replace('Bearer', '').trim()
        if (token) {
            const decoded = jwt.verify(token, authenticationToken)
            if (decoded.exp <= (Date.now() / 1000)) {
                response.statusCode = STATUS_CODE.EXPIRED_VALUE
                response.message = AUTHENTICATION.TOKEN_EXPIRED
            } else {
                const isUser = await validateUser(`${token}`, decoded.id)
                if (!isUser) {
                    response.statusCode = STATUS_CODE.INVALID_VALUE
                    response.message = AUTHENTICATION.INVALID_TOKEN
                } else {
                    req.body.userOwn = decoded.id
                }
            }
        }
    } catch (err) {
        response.statusCode = STATUS_CODE.SERVER_ERROR
        response.message = AUTHENTICATION.TOKEN_NOT_FOUND
        response.hasError = true
    }

    if (response.hasError) {
        res.send(response)
    } else {
        next()
    }
}

module.exports = {
    genJWTToken,
    isAuthenticate,
    validateUser,
    removeToken
}
