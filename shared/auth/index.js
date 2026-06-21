// index.js
// Entrypoint for shared/auth package

const permissions = require('./permissions');
const authMiddleware = require('./authMiddleware');

/**
 * Asynchronously log audit event without blocking the API request-response cycle (fire-and-forget).
 * Includes actor, action, timestamp, and target resource context.
 */
const logAuditEvent = (req, { actionType, resource, resourceId, status, message }) => {
  const auditServiceUrl = process.env.AUDIT_SERVICE_URL || 'http://audit-service:3000';
  const payload = {
    actionType,
    resource,
    resourceId,
    status,
    message,
    actorId: req.user?.id || req.user?.userId || 'SYSTEM',
    actorEmail: req.user?.email || 'system@elderpinq.com',
    actorRole: req.user?.role || 'SYSTEM',
    timestamp: new Date().toISOString()
  };

  // Perform background HTTP post
  import('node-fetch')
    .then(({ default: fetch }) => {
      return fetch(`${auditServiceUrl}/audit`, {
        method: 'POST',
        headers: {
          'Authorization': req.headers?.authorization || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    })
    .then((res) => {
      if (!res.ok) {
        console.error(`[AUDIT HOOK WARNING] Audit service responded with status ${res.status}`);
      }
    })
    .catch((err) => {
      console.error('[AUDIT HOOK ERROR] Failed to send audit log asynchronously:', err.message);
    });
};

module.exports = {
  ...permissions,
  ...authMiddleware,
  logAuditEvent
};
