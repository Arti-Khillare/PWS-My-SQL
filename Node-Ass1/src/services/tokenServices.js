const jwt = require('jsonwebtoken');

exports.generateToken = async (userId, role) => {
    const payload = {
        userId: userId,
        role : role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
      };
      return jwt.sign(payload, 'secretKey');
}

exports.saveToken = async (userId, role, token) => {
    const tokenData = {
        userId: userId,
        role: role,
        token: token,
      };
    return tokenData
}

