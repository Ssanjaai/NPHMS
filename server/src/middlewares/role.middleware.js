const ApiError = require('../helpers/error.helper');

/**
 * @desc    Grant access to specific roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authorized to access this route'));
    }

    const userRole = req.user.role ? req.user.role.toUpperCase() : '';
    
    // Normalize role strings (e.g., 'ADMIN' is same as 'BRANCH_ADMIN')
    const normalizedUserRole = userRole === 'SUPER_ADMIN'
      ? 'SUPER_ADMIN'
      : (userRole === 'ADMIN' || userRole === 'BRANCH_ADMIN' ? 'BRANCH_ADMIN' : userRole);

    const normalizedAllowedRoles = roles.map(role => {
      const r = role.toUpperCase();
      return r === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : (r === 'ADMIN' || r === 'BRANCH_ADMIN' ? 'BRANCH_ADMIN' : r);
    });

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      return next(
        new ApiError(
          403,
          `User role ${req.user.role} is not authorized to access this route`
        )
      );
    }
    next();
  };
};

module.exports = authorize;
