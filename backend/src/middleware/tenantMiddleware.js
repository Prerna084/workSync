const tenantMiddleware = (req, res, next) => {
  if (!req.user || !req.user.tenant_id) {
    return res.status(403).json({ message: "No tenant access. You are not part of an organization." });
  }
  next();
};

module.exports = tenantMiddleware;
