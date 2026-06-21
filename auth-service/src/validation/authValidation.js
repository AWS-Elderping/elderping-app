// authValidation.js
// Express-level input validation middleware for authentication and administration endpoints

const validateRegister = (req, res, next) => {
  const { username, password, email, role } = req.body;
  
  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' });
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  if (email && (typeof email !== 'string' || !email.includes('@'))) {
    return res.status(400).json({ error: 'Email must be a valid format' });
  }
  if (role) {
    const finalRole = role.toUpperCase();
    const allowed = ['SUPER_ADMIN', 'ADMIN', 'FAMILY', 'ELDER', 'USER', 'CAREGIVER'];
    if (!allowed.includes(finalRole)) {
      return res.status(400).json({ error: `Invalid role. Allowed roles: ${allowed.join(', ')}` });
    }
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  next();
};

const validateUpdateRole = (req, res, next) => {
  const { role } = req.body;
  if (!role || typeof role !== 'string') {
    return res.status(400).json({ error: 'Role is required and must be a string' });
  }
  const allowed = ['SUPER_ADMIN', 'ADMIN', 'FAMILY', 'ELDER', 'USER', 'CAREGIVER'];
  if (!allowed.includes(role.toUpperCase())) {
    return res.status(400).json({ error: `Invalid role. Allowed roles: ${allowed.join(', ')}` });
  }
  next();
};

const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;
  if (!status || typeof status !== 'string') {
    return res.status(400).json({ error: 'Status is required and must be a string' });
  }
  const allowed = ['ACTIVE', 'SUSPENDED', 'INACTIVE'];
  if (!allowed.includes(status.toUpperCase())) {
    return res.status(400).json({ error: `Invalid status. Allowed statuses: ${allowed.join(', ')}` });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateRole,
  validateUpdateStatus
};
