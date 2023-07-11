module.exports = {
    AUTHENTICATION: {
        SUCCESS: 'Token is valid',
        INVALID_TOKEN: 'Invalid token. Please login again',
        TOKEN_EXPIRED: 'Your session has expired. Please login again',
        TOKEN_NOT_FOUND: 'Invalid request. Please login again',
        EXCEPTION: 'You cannot do any actions now. Please contact our support team.',
        UNAUTHORIZED: 'Yor are not authorized to perform this operation.'
    },
    LOGIN: {
        SUCCESS: 'Login is successful',
        INVALID_ACCOUNT: ' This account doesn\'t exist. Please sign up',
        INVALID_EMAIL: 'You entered an invalid email address',
        UNVERIFIED_MAIL: ' Please veify your email address. Click here to resend verification code ',
        WRONG_PASS_EMAIL: 'Your username or password is wrong',
        EXCEPTION: 'Please contact our support team to help'
    },
    LOGOUT: {
        SUCCESS: 'You have successfully logged out',
        EXCEPTION: 'Oops! Something went wrong. Please contact our support team.'
    },
    SIGNUP: {
        SUCCESS: 'Your account registration is successful',
        EMAIL_EXIST: 'This email already exists. Please login.',
        RESEND_CODE: 'Verification code successfully sent to your email',
        RESEND_PWD: 'A new passwordsuccessfully sent to your email',
        USER_NOT_EXIST: 'This user does not exist',
        EXCEPTION: 'Our system is busy, kindly go back in couple hours for singing up'
    },
    VERIFY_MESSAGE: {
        SUCCESS: 'Your account verificaiton is successful.',
        INVALID_PASSCODE: 'The verification code is wrong. Please try again',
        EXPIRED_PASSCODE: 'The verification code has expired. Click here to resend one',
        EMAIL_NOT_FOUND: 'You will receive an email in your inbox if this email is registered on Platform.',
        EXCEPTION: 'It seems you cannot verify your code now, kindly try in a minute'
    },
    USER: {
        SUCCESS: 'Your request is successfull',
        UPDATED: 'Your profile updated successfully',
        NOT_EXIST: 'This user does not exist',
        EXCEPTION: 'Oops! Something went wrong. Please contact our support team.'
        
    },
    VERIFY_STATUS: {
        VERIFIED: 'verified',
        UNVERIFIED: 'unverified'
    },

    TYPE_LOG: {
        USER: 'USER',
        PROJECT: 'PROJECT'
    },
    PROJECT: {
        SUCCESS: 'Your request is successfully executed.',
        SUCCESSFULLY_ADDED: 'Your project is successfully addeed',
        TITLE_EXIST: 'Title exists, kindly change the title & try again',
        EXCEPTION: 'Our system is busy, kindly try again after some time',
        NOT_FOUND: "Project Doesn't exist",
        SUCCESSFULLY_LIKED: "Project is succefully liked",
        SUCCESSFULLY_UNLIKED: "Project is successfully unliked",
        SUCCESSFULLY_UPDATED: "Project is successfully updated"
    }
}
