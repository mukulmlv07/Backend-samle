const verifyEmail = require('./verify-email')
const signup = require('./signup')
const login = require('./login')
const resetPassword = require('./reset-password')
const project = require('./project.js')
const getUserAllProjects = require('./get-user-all-project')
const getProjectsByStatus = require('./get-project-by-status')
const likeProject = require('./like-project')
module.exports = {
    verifyEmail,
    resetPassword,
    signup,
    login,
    project,
    getUserAllProjects,
    getProjectsByStatus,
    likeProject
}
