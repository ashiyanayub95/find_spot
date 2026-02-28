const Location = require('../models/location.model');
const Booking = require('../models/booking.models')
const { uploadFile } = require('../services/storage');



async function createLocation(req, res) {
  try {
    const { name, address, city, rules, price } = req.body;
    const user = req.user;
    console.log("Creating location for user:", user.id); // Debugging line

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Photos are required" });
    }

    const uploadedPhotoUrls = [];

    for (const file of req.files) {
      const photoUrl = await uploadFile(
        file.buffer.toString("base64"),
        file.originalname
      );
      uploadedPhotoUrls.push(photoUrl);
    }

    const newLocation = new Location({
      onwerId: user.id, // FIX spelling
      name,
      address,
      city,
      photos: uploadedPhotoUrls , // save URLs not base64
      rules,
      price: Number(price),
    });

    await newLocation.save();

    res.status(201).json({
      message: "Location created successfully",
      location: newLocation,
    });

  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ message: "Server error" });
  }
}
 

async function getAllLocations(req, res) {
    const user = req.user;
    console.log("Fetching locations for user:", user.id); // Debugging line
    try {
        const locations = await Location.find(
            { onwerId: user.id } // FIX spelling
        );
         res.status(200).json(locations);    
    } catch (error) {
        console.error("Error fetching locations:", error);
        res.status(500).json({ message: "Server error" });
    }
}


async function deleteLocation(req, res) {
    parms = req.params;
    try {
        const location = await Location.findByIdAndDelete(parms.id);
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }
        res.status(200).json({
            message: "Location deleted successfully",
            location});

    } catch (error) {
        console.error("Error deleting location:", error);
        res.status(500).json({ message: "Server error" });  
    }
}


async function getOwnerBookings(req, res) {
  try {
    const ownerId = req.user.id;

    // Get locations of this owner
    const locations = await Location.find({ 
        onwerId: ownerId 
     });
    const locationIds = locations.map(loc => loc._id);

    // Fetch bookings for those locations
    const bookings = await Booking.find({ locationId: { $in: locationIds } })
                                  .populate("userId", "firstName lastName email")
                                  .populate("locationId", "name address");

    res.status(200).json({ bookings });

  } catch (err) {
    console.error("Error fetching owner bookings:", err);
    res.status(500).json({ message: "Server error" });
    
  }
}

async function confirmBooking(req, res) {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "confirmed";
    await booking.save();

    res.status(200).json({ message: "Booking confirmed", booking });
  } catch (err) {
    console.error("Error confirming booking:", err);
    res.status(500).json({ message: "Server error" });
  }
}


async function cancelBooking(req, res) {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled", booking });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    res.status(500).json({ message: "Server error" });
  }
}




module.exports = {
    createLocation , getAllLocations , deleteLocation, getOwnerBookings,confirmBooking,cancelBooking};