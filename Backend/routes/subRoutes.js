const express = require('express');
const router = express.Router();
const { getSubs, addSub, deleteSub } = require('../controllers/subController');

router.get('/', getSubs);
router.post('/', addSub);
router.delete('/:id', deleteSub);

module.exports = router;