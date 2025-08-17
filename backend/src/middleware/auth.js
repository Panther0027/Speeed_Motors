const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not found' }
        });
      }

      // Check if user is active
      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          error: { message: 'User account is deactivated' }
        });
      }

      next();
    } catch (error) {
      logger.error('Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        error: { message: 'Not authorized, token failed' }
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'Not authorized, no token' }
    });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Not authorized, no user' }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: `User role ${req.user.role} is not authorized to access this route` }
      });
    }

    next();
  };
};

// Optional authentication (for public routes that can show different content for authenticated users)
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token is invalid, but we don't block the request
      logger.debug('Optional auth failed:', error.message);
    }
  }

  next();
};

// Check if user owns the resource or has admin role
const checkOwnership = (model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const resource = await model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: { message: 'Resource not found' }
        });
      }

      // Admin can access all resources
      if (req.user.role === 'admin') {
        req.resource = resource;
        return next();
      }

      // Check if user owns the resource
      if (resource.user && resource.user.toString() === req.user.id) {
        req.resource = resource;
        return next();
      }

      // Check if user is assigned to the resource (for technicians, sales agents, etc.)
      if (resource.assignedTo && resource.assignedTo.toString() === req.user.id) {
        req.resource = resource;
        return next();
      }

      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to access this resource' }
      });
    } catch (error) {
      logger.error('Ownership check failed:', error.message);
      return res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  };
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  checkOwnership
};
