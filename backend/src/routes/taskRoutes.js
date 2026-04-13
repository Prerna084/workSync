const express = require('express');
const { createTask, getTasks, updateTaskStatus, getTaskStats } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply middleware to all task routes
router.use(authMiddleware);
router.use(tenantMiddleware);

// Only ADMIN can create tasks
router.post('/', roleMiddleware(["ADMIN"]), createTask);
// Both ADMIN + MEMBER can view stats centrally
router.get('/stats', roleMiddleware(["ADMIN", "MEMBER"]), getTaskStats);
// Both ADMIN + MEMBER can view tasks
router.get('/', roleMiddleware(["ADMIN", "MEMBER"]), getTasks);
// Both ADMIN + MEMBER can update status
router.patch('/:id/status', roleMiddleware(["ADMIN", "MEMBER"]), updateTaskStatus);

module.exports = router;
