import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check if authorization header is present and correctly formatted
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    // Verify token signature using our server secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Inject verified user metadata (e.g. id) into the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error(`[Auth Middleware Error]: ${error.message}`);
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};
