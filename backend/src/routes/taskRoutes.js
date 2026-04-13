const express = require('express');
const { createTask, getTasks, updateTaskStatus } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');

const router = express.Router();

// Apply middleware to all task routes
router.use(authMiddleware);
router.use(tenantMiddleware);

router.post('/', createTask);
router.get('/', getTasks);
router.patch('/:id/status', updateTaskStatus);

module.exports = router;
