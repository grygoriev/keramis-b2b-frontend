// discount.routes.js
const express = require('express');
const router = express.Router();
const isInternalManager = require('../middlewares/isInternalManager');
const discountCtrl = require('../controllers/discount.controller');

// GET /pricing/group-discounts/
router.get('/group-discounts/', isInternalManager, discountCtrl.getGroupDiscounts);

// POST /pricing/group-discounts/
router.post('/group-discounts/', isInternalManager, discountCtrl.createGroupDiscount);

// PATCH /pricing/group-discounts/:discountId/
router.patch('/group-discounts/:discountId/', isInternalManager, discountCtrl.updateGroupDiscount);

// DELETE /pricing/group-discounts/:discountId/
router.delete('/group-discounts/:discountId/', isInternalManager, discountCtrl.deleteGroupDiscount);

module.exports = router;
