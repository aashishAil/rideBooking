const router = require('express').Router();

const controller = require('./controller');

router.put('/',controller.createRequest);
router.post('/:requestId',controller.updateRequest);
router.get('/',controller.getAllRequests);
router.get('/:driverId',controller.getDriverRequests);

module.exports = router;
