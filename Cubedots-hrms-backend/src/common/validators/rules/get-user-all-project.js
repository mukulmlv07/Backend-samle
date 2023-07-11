module.exports = {
    userId: {
        in: ['body'],
        exists: true,
        errorMessage: 'UserId is not given'
    }
}
