const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/user.controller');
const validateRequest = require('../middleware/validation.middleware');
const {authorizeRoles} = require('../utils/auth.check');

router.get('/all/locations', authorizeRoles('user') , usercontroller.getAllLocations);
router.post('/check/date', authorizeRoles('user') ,usercontroller.checkAvailability )
router.post('/create/bookings',authorizeRoles('user'), usercontroller.createBooking),


module.exports = router;