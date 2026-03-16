const cookieParser = require('cookie-parser');
const express = require('express');
const authRoutes = require('./routes/auth.routes');
const locationOwnerRoutes = require('./routes/location.routes');
const userRoutes = require('./routes/user.routes');


const app = express();

app.use(express.json());
app.use(cookieParser());



app.get('/health', (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use('/api/auth', authRoutes);
app.use('/api/locations', locationOwnerRoutes);
app.use('/api/user', userRoutes);



module.exports = app;