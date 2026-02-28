const mongoose = require('mongoose');



const BookingSchema = new mongoose.Schema({
  locationId:
   { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Location', 
    required: true },
  userId: 
  { type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true },
  date:
   { type: Date, 
    required: true },
  startTime: 
  { type: String, 
    required: true }, // e.g., "10:00"
  endTime: 
  { type: String, required: true },   // e.g., "12:00"
  status: 
  { type: String, 
    enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentId :{
   type: String, 
   required:true
  }

});


const BookingModel =  mongoose.model('Bookings', BookingSchema );

module.exports = BookingModel;
