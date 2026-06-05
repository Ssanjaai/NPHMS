const { admin } = require('../config/firebase.config');
const ApiError = require('../helpers/error.helper');
const logger = require('../config/logger.config');

const userRepository = require('../repositories/user.repository');

/**
 * @desc    Verify Firebase ID Token
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized to access this route'));
  }

  try {
    // Verify token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Fetch database user by Firebase UID
    const dbUser = await userRepository.findByFirebaseUid(decodedToken.uid);
    if (!dbUser) {
      return next(new ApiError(401, 'User not found in system'));
    }

    // Merge Firebase decoded token with database user details
    req.user = {
      ...decodedToken,
      id: dbUser.id,
      role: dbUser.role,
      status: dbUser.status
    };
    
    next();
  } catch (error) {
    logger.error('Firebase token verification failed:', error);
    return next(new ApiError(401, 'Not authorized to access this route'));
  }
};

module.exports = {
  protect,
};
