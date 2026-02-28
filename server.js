require('dotenv').config();
const app = require('./src/app');
const ConnectDB = require('./src/db/db');

ConnectDB();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});