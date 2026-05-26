const authService = require('../services/auth.service');
const { sendResponse } = require('../helpers/response.helper');

class AuthController {

  login = async (req, res) => {
    try {
      const { token } = req.body;
      const user = await authService.verifyUser(token);
      
      // Normalize user role for the frontend
      const userJson = user.toJSON ? user.toJSON() : { ...user };
      if (userJson.role) {
        const uppercaseRole = userJson.role.toUpperCase();
        userJson.role = uppercaseRole === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : (uppercaseRole === 'ADMIN' ? 'BRANCH_ADMIN' : uppercaseRole);
      }

      return sendResponse(res, 200, 'Login successful', userJson);
    } catch (error) {
      return sendResponse(res, 401, error.message || 'Invalid credentials');
    }
  };

  register = async (req, res) => {
    const user = await authService.register(req.body);
    return sendResponse(res, 201, 'Registration successful', user);
  };

  getMe = async (req, res) => {
    const user = await authService.getProfile(req.user.id);
    
    // Normalize user role for the frontend
    const userJson = user.toJSON ? user.toJSON() : { ...user };
    if (userJson.role) {
      const uppercaseRole = userJson.role.toUpperCase();
      userJson.role = uppercaseRole === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : (uppercaseRole === 'ADMIN' ? 'BRANCH_ADMIN' : uppercaseRole);
    }

    return sendResponse(res, 200, 'Profile retrieved successfully', userJson);
  };
}

module.exports = new AuthController();