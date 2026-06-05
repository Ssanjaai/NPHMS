const userRepository = require('../repositories/user.repository');
const healerRepository = require('../repositories/healer.repository');
const patientRepository = require('../repositories/patient.repository');
const ApiError = require('../helpers/error.helper');
const { admin } = require('../config/firebase.config');

class AuthService {
  /**
   * @desc    Login/Verify user via Firebase Token
   */
  async verifyUser(firebaseToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
      const { uid, email } = decodedToken;

      let user = await userRepository.findByFirebaseUid(uid);

      if (!user) {
        // Fallback: Check if user exists by email (useful for seeded/pre-existing users)
        user = await userRepository.findByEmail(email);
        if (user) {
          user = await userRepository.update(user.id, { firebaseUid: uid });
        } else {
          throw new ApiError(401, 'User not found in system. Please contact administrator.');
        }
      }

      if (user.status !== 'active') {
        throw new ApiError(403, 'Your account is deactivated.');
      }

      return user;
    } catch (error) {
      const logger = require('../config/logger.config');
      logger.error('Firebase verifyIdToken failed:', error);
      if (error instanceof ApiError) throw error;
      throw new ApiError(401, 'Invalid or expired token.');
    }
  }

  /**
   * @desc    Register user via Firebase Token
   */
  async register(data) {
    const { token, name, role, phoneNumber, branchId } = data;
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { uid, email } = decodedToken;

      // Check if user already exists
      let existingUser = await userRepository.findByFirebaseUid(uid);
      if (existingUser) {
        throw new ApiError(400, 'User already exists.');
      }

      // Map incoming role string to backend db roles
      let dbRole = 'user';
      if (role) {
        const upperRole = role.toUpperCase();
        if (upperRole === 'SUPER_ADMIN') {
          dbRole = 'super_admin';
        } else if (upperRole === 'BRANCH_ADMIN' || upperRole === 'ADMIN') {
          dbRole = 'admin';
        } else if (upperRole === 'HEALER') {
          dbRole = 'healer';
        } else if (upperRole === 'PATIENT') {
          dbRole = 'patient';
        } else {
          dbRole = role.toLowerCase();
        }
      }

      // Create new user in local DB
      const newUser = await userRepository.create({
        firebaseUid: uid,
        email,
        name,
        role: dbRole,
        phoneNumber,
        branchId,
        status: 'active'
      });

      // Automatically create healer/patient profile in their respective tables
      if (dbRole === 'healer') {
        await healerRepository.create({
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phoneNumber,
          status: 'active',
          branchId: newUser.branchId
        });
      } else if (dbRole === 'patient') {
        const count = await patientRepository.findAll();
        const patientId = `PAT-${Date.now()}-${count.length + 1}`;
        await patientRepository.create({
          name: newUser.name,
          patientId,
          phone: newUser.phoneNumber,
          status: 'active',
          branchId: newUser.branchId
        });
      }

      return newUser;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(401, 'Invalid or expired token.');
    }
  }

  /**
   * @desc    Get Current User Profile
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    return user;
  }
}

module.exports = new AuthService();
