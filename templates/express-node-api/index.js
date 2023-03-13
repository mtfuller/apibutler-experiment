const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const employeeController = require('./controllers/EmployeeController');
const db = require('./db');

// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function main() {
  await db.connect();

  // Define routes
  app.use('/employees', employeeController);

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Server started on port" + PORT);
  });
}

main();