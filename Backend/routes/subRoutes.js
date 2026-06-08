const express = require('express');
const router = express.Router();
const { getSubs, addSub, deleteSub, updateSub } = require('../controllers/subController');

router.get('/', getSubs);
router.post('/', addSub);
router.delete('/:id', deleteSub);
router.put('/:id', updateSub);

module.exports = router;