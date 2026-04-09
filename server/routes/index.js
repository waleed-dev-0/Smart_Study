const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Server is running! API v1' });
});

router.get('/test-db', testController.testDb);
router.get('/test-relations', testController.testRelations);

module.exports = router;
