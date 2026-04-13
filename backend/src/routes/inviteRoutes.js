const express = require('express');
const { generateInvite, joinWithInvite } = require('../controllers/inviteController');
const authMiddleware = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Public route to consume an invite string and register
router.post('/join', joinWithInvite);

// Private routes for generating invites (Admin only within an Org)
router.use(authMiddleware);
router.use(tenantMiddleware);
router.use(roleMiddleware(['ADMIN'])); 
router.post('/generate', generateInvite);

module.exports = router;
