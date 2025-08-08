// middleware/auth.js
import jwt from 'jsonwebtoken'; // Use ES modules
import { config } from 'dotenv';
config()

const JWT_SECRET = process.env.JWT_SECRET

export const authenticateUser = (req, res, next) => {
  // 1. Extract token from request headers (common: Authorization: Bearer <token>)
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required: No token provided' });
  }

  // 2. Extract the token (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify the token's signature
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. Attach decoded user data to req (for use in route handlers)
    req.user = {
      id: decoded.userId, // Matches the data you included when generating the token
      email: decoded.email,
      username: decoded.username,
      
    };

    // 5. Proceed to the next middleware/route handler
    next();

  } catch (error) {
    
    // Handle invalid/tampered/expired tokens
    if (error.name === 'JsonWebTokenError') {
      
      return res.status(401).json({ message: 'Invalid token: Tampered or malformed' });
    }
    if (error.name === 'TokenExpiredError') {
      
      return res.status(401).json({ message: 'Token expired: Please log in again' });
    }
    // Catch other unexpected errors
    return res.status(500).json({ message: 'Authentication failed' });
  }
};