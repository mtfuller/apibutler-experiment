const ASSIGNMENT_RESPONSE = `
\`\`\`json
{
    "ACTION": "RUN_COMMAND",
    "COMMANDS": ["npm init -y"]
}
\`\`\`
\`\`\`json
{
    "ACTION": "RUN_COMMAND",
    "COMMANDS": ["npm install express mongoose body-parser"]
}
\`\`\`
\`\`\`json
{
    "ACTION": "CREATE_FILE",
    "TYPE": "INDEX",
    "NAME": "index.js"
}
\`\`\`
\`\`\`json
{
    "ACTION": "CREATE_FILE",
    "TYPE": "DB",
    "NAME": "db.js"
}
\`\`\`
\`\`\`json
{
    "ACTION": "CREATE_FILE",
    "TYPE": "CONTROLLER",
    "NAME": "EmployeeController.js",
    "ENDPOINT": "/employees"
}
\`\`\`
\`\`\`json
{
    "ACTION": "CREATE_FILE",
    "TYPE": "SERVICE",
    "NAME": "EmployeeService.js"
}
\`\`\`
\`\`\`json
{
    "ACTION": "CREATE_FILE",
    "TYPE": "MODEL",
    "NAME": "Employee.js",
    "SCHEMA": {
        "first_name": "string",
        "last_name": "string",
        "manager": "number",
        "salary": "number",
        "job_title": "string"
    }
}
\`\`\`
\`\`\`json
{
    "ACTION": "CREATE_FILE",
    "TYPE": "DOCKERFILE",
    "NAME": "Dockerfile"
}
\`\`\`
\`\`\`json
{
    "ACTION": "CREATE_FILE",
    "TYPE": "DOCKER_COMPOSE",
    "NAME": "docker-compose.yml"
}
\`\`\``

const INDEX_JS = `\`\`\`javascript
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const controller = require('./EmployeeController');
const db = require('./db');

// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function main() {
  await db.connect();

  // Define routes
  app.get('/', controller.home);
  app.get('/employees', controller.getEmployees);
  app.get('/employees/:id', controller.getEmployeeById);
  app.post('/employees', controller.createEmployee);
  app.put('/employees/:id', controller.updateEmployee);
  app.delete('/employees/:id', controller.deleteEmployee);

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Server started on port" + PORT);
  });
}

main();
\`\`\``

const CONTROLLER_JS = `\`\`\`javascript
const EmployeeService = require('./EmployeeService');

const employeeService = new EmployeeService();

const controller = {};

controller.home = (req, res) => {
  res.send('Welcome to the Employee API!');
};

controller.getEmployees = async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.json(employees);
  } catch (err) {
    res.status(500).send(err);
  }
};

controller.getEmployeeById = async (req, res) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    res.json(employee);
  } catch (err) {
    res.status(500).send(err);
  }
};

controller.createEmployee = async (req, res) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).send(err);
  }
};

controller.updateEmployee = async (req, res) => {
  try {
    const employee = await employeeService.updateEmployeeById(
      req.params.id,
      req.body
    );
    res.json(employee);
  } catch (err) {
    res.status(500).send(err);
  }
};

controller.deleteEmployee = async (req, res) => {
  try {
    await employeeService.deleteEmployeeById(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = controller;
\`\`\``

const SERVICE_JS = `\`\`\`javascript
const Employee = require('./Employee');

class EmployeeService {
  constructor() {}

  async getAllEmployees() {
    const employees = await Employee.find({});
    return employees;
  }

  async getEmployeeById(id) {
    const employee = await Employee.findById(id);
    if (!employee) {
      throw new Error("Employee with ID " + id + " not found");
    }
    return employee;
  }

  async createEmployee(employeeData) {
    const employee = new Employee(employeeData);
    await employee.save();
    return employee;
  }

  async updateEmployeeById(id, employeeData) {
    const employee = await Employee.findByIdAndUpdate(
      id,
      employeeData,
      { new: true }
    );
    if (!employee) {
      throw new Error("Employee with ID " + id + " not found");
    }
    return employee;
  }

  async deleteEmployeeById(id) {
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      throw new Error("Employee with ID " + id + " not found");
    }
  }
}

module.exports = EmployeeService;
\`\`\``

const MODEL_JS = `\`\`\`javascript
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  manager: { type: Number, required: true },
  salary: { type: Number, required: true },
  job_title: { type: String, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
\`\`\`
`

const DB_JS = `\`\`\`javascript
const mongoose = require('mongoose');

// Replace the connection string with the URI for your own local MongoDB instance
const uri = 'mongodb://mongo:27017/mydatabase';

async function connect() {
  try {
    // Connect to the MongoDB instance using Mongoose
    await mongoose.connect(uri);

    // Log a message indicating that the connection was successful
    console.log('Connected to MongoDB');

    // Return the Mongoose connection object for use in other parts of the application
    return mongoose.connection;
  } catch (err) {
    // If an error occurs while connecting, log the error message and throw the error
    console.error('Error connecting to MongoDB', err);
    throw err;
  }
}

module.exports = { connect };
\`\`\``

const DOCKERFILE = `\`\`\`dockerfile
FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
\`\`\``

const DOCKER_COMPOSE = `\`\`\`yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - mongo
  mongo:
    image: mongo
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongodata:/data/db

volumes:
  mongodata:
\`\`\``

export class ChatGPT {
    async chat(prompt: string) {
        return `I heard your message: \"${prompt}\". I am an AI!`
    }

    async demoChat(prompt: string) {
        await new Promise(r => setTimeout(r, 2000));

        if (prompt === "ASSIGNMENT") {
            return ASSIGNMENT_RESPONSE;
        } else if (prompt.includes(`"category": "INDEX"`)) {
            return INDEX_JS;
        } else if (prompt.includes(`"category": "CONTROLLER"`)) {
            return CONTROLLER_JS;
        } else if (prompt.includes(`"category": "SERVICE"`)) {
            return SERVICE_JS;
        } else if (prompt.includes(`"category": "MODEL"`)) {
            return MODEL_JS;
        } else if (prompt.includes(`"category": "DB"`)) {
          return DB_JS;
        } else if (prompt.includes(`"category": "DOCKERFILE"`)) {
            return DOCKERFILE;
        } else if (prompt.includes(`"category": "DOCKER_COMPOSE"`)) {
            return DOCKER_COMPOSE;
        } else {
            return "I don't know what you wanted.";
        }
    }
}