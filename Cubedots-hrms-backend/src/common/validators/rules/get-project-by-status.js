module.exports = {
  userId: {
    in: ['body'],
    exists: true,
    errorMessage: 'UserId is not given',
  },
  status: {
    in: ['body'],
    exists: true,
    errorMessage: 'status is not given',
  },
};
