const express = require('express');
const Location = require('../models/location.model');
const Booking = require('../models/booking.models')


async  function getAllLocations(req, res) {
    const user = req.user;
    console.log("Fetching locations for user:", user.id);
    try {
        const location = await Location.find(); ;
        res.status(200).json(location);
    }
    catch (error) {
        console.error("Error fetching locations:", error);  

}
}

async function LocationById(req, res) {
    const params = req.params;
    try {
        const location = await Location.findById(params.id);
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }
        res.status(200).json({
            message: "Location fetched successfully",
            location
        });
    } catch (error) {
        console.error("Error fetching location:", error);   

    }
}

async function checkAvailability(req, res) {
  const { locationId, date, startTime, endTime } = req.body;

  try {
    // Get all confirmed bookings for that location on that date
    const bookings = await Booking.find({
      locationId,
      date,
      status: "confirmed"
    });

    // Convert times to comparable numbers (optional: HH:mm to minutes)
    const [reqStartHour, reqStartMin] = startTime.split(":").map(Number);
    const [reqEndHour, reqEndMin] = endTime.split(":").map(Number);
    const reqStart = reqStartHour * 60 + reqStartMin;
    const reqEnd = reqEndHour * 60 + reqEndMin;

    let isAvailable = true;

    for (const booking of bookings) {
      const [bStartHour, bStartMin] = booking.startTime.split(":").map(Number);
      const [bEndHour, bEndMin] = booking.endTime.split(":").map(Number);

      const bookedStart = bStartHour * 60 + bStartMin;
      const bookedEnd = bEndHour * 60 + bEndMin;

      if (reqStart < bookedEnd && bookedStart < reqEnd) {
        // Overlapping booking exists
        isAvailable = false;
        break;
      }
    }

    res.status(200).json({ locationId, date, startTime, endTime, available: isAvailable });

  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ message: "Server error" });
  }
}


async function createBooking(req, res) {
  const { locationId, date, startTime, endTime,paymentId } = req.body;
  const userId = req.user.id;
  try{
      const booking = new Booking({
      userId,
      locationId,
      date,
      startTime,
      endTime,
      status: "pending",
      paymentId:paymentId || "test_payment"
    });

    await booking.save(); 

    res.status(201).json({ message: "Booking created, pending confirmation", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}







module.exports = { getAllLocations , LocationById,checkAvailability,createBooking};
