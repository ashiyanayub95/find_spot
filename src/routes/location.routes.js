const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const validateRequest = require('../middleware/validation.middleware');
const multer = require('multer');
const {authorizeRoles}  = require('../utils/auth.check');

// multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('photos', 5);


router.post('/create', authorizeRoles('owner'),upload, locationController.createLocation);
router.get('/all', authorizeRoles('owner'), locationController.getAllLocations);
router.get('/bookings',authorizeRoles('owner'),locationController.getOwnerBookings)
router.post('/confirm' ,authorizeRoles('owner'),locationController.confirmBooking)
router.post('/cancel',authorizeRoles('owner'),locationController.cancelBooking)

module.exports = router;