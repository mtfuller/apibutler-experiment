import { TaskFile, FileType, BetterTask } from "../../../core/Task";
import { BasePrompt, generateAssistantMessage, generateSystemMessage, generateUserMessage, Message } from "./BasePrompt";

const systemMessage = generateSystemMessage(`Act as a AI that can generate new code, based on instructions written in JSON format. You will be given a JSON object and you will need to convert it into an appropriate JavaScript file.`);

const EXAMPLE_PROMPT = `The product team has announced the highest priority feature we need to implement is to create a new API that can keep track of employee data. Create an API with an endpoint, called "/employees". This endpoint will be used to manage employee data. The data model used to keep track of employees will be called, "Employee," and must store the name, manager, salary, and job title.`

const MAIN_INPUT = `${EXAMPLE_PROMPT}
\`\`\`json
{
    "type": "MAIN",
    "filename": "./index.js",
    "packages": ["express", "body-parser"],
    "dependencies": ["./controllers/EmployeeController", "./db"]
}
\`\`\`
`

const MAIN_OUTPUT = `\`\`\`javascript
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
\`\`\``

const CONTROLLER_INPUT = `${EXAMPLE_PROMPT}
\`\`\`json
{
    "type": "CONTROLLER",
    "filename": "./controllers/EmployeeController.js",
    "packages": ["express"],
    "dependencies": ["../services/EmployeeService"]
}
\`\`\``

const CONTROLLER_OUTPUT = `\`\`\`javascript
const express = require('express');
const controller = express.Router();
const EmployeeService = require('../services/EmployeeService');

const employeeService = new EmployeeService();

controller.get('/', async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.json(employees);
  } catch (err) {
    res.status(500).send(err);
  }
});

controller.get('/employees/:id', async (req, res) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    res.json(employee);
  } catch (err) {
    res.status(500).send(err);
  }
});

controller.post('/employees', async (req, res) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).send(err);
  }
});

controller.put('/employees/:id', async (req, res) => {
  try {
    const employee = await employeeService.updateEmployeeById(
      req.params.id,
      req.body
    );
    res.json(employee);
  } catch (err) {
    res.status(500).send(err);
  }
});

controller.delete('/employees/:id', async (req, res) => {
  try {
    await employeeService.deleteEmployeeById(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = controller;
\`\`\``

const SERVICE_INPUT = `${EXAMPLE_PROMPT}
\`\`\`json
{
    "type": "SERVICE",
    "filename": "./services/EmployeeService.js",
    "packages": [],
    "dependencies": ["../models/Employee"]
}
\`\`\`
`

const SERVICE_OUTPUT = `\`\`\`javascript
const Employee = require('../models/Employee');

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

const MODEL_INPUT = `${EXAMPLE_PROMPT}
\`\`\`json
{
    "type": "MODEL",
    "filename": "./models/Employee.js",
    "packages": ["mongoose"],
    "dependencies": []
}
\`\`\``

const MODEL_OUTPUT = `\`\`\`javascript
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
\`\`\``

const DB_CONFIG_INPUT = `${EXAMPLE_PROMPT}
\`\`\`json
{
    "type": "DB_CONFIG",
    "filename": "./db.js",
    "packages": ["mongoose"],
    "dependencies": []
}
\`\`\``

const DB_CONFIG_OUTPUT = `\`\`\`javascript
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

const DOCKERFILE_INPUT = `${EXAMPLE_PROMPT}
\`\`\`json
{
    "type": "DOCKERFILE",
    "filename": "./Dockerfile",
    "packages": [],
    "dependencies": []
}
\`\`\``

const DOCKERFILE_OUTPUT = `\`\`\`dockerfile
FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
\`\`\``

const DOCKER_COMPOSE_INPUT = `${EXAMPLE_PROMPT}
\`\`\`json
{
    "type": "DOCKER_COMPOSE",
    "filename": "./docker-compose.yml",
    "packages": [],
    "dependencies": []
}
\`\`\`
`

const DOCKER_COMPOSE_OUTPUT = `\`\`\`yaml
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

const mapping: Record<FileType, string[]> = {
    "MAIN": [
        MAIN_INPUT,
        MAIN_OUTPUT,
    ],
    "CONTROLLER": [
        CONTROLLER_INPUT,
        CONTROLLER_OUTPUT,
    ],
    "SERVICE": [
        SERVICE_INPUT,
        SERVICE_OUTPUT,
    ],
    "MODEL": [
        MODEL_INPUT,
        MODEL_OUTPUT
    ],
    "DB_CONFIG": [
      DB_CONFIG_INPUT,
      DB_CONFIG_OUTPUT
    ],
    "DOCKERFILE": [
        DOCKERFILE_INPUT,
        DOCKERFILE_OUTPUT
    ],
    "DOCKER_COMPOSE": [
        DOCKER_COMPOSE_INPUT,
        DOCKER_COMPOSE_OUTPUT
    ]
}

export default (assignment: string, task: BetterTask): BasePrompt => {
    console.log("GenerateCodeV2Prompt")

    console.log(`TYPE: ${task.type}`)  

    const a = mapping[task.type];

    console.log(`VALUE: ${a[0]} ${a[1]}`)  

    const exampleUser = generateUserMessage(a[0]);
    const exampleAssistant = generateAssistantMessage(a[1]);

    const userMessage = `${assignment}
  \`\`\`json
  ${JSON.stringify(task, null, 2)}
  \`\`\`
    `

    return [
        systemMessage,
        exampleUser,
        exampleAssistant,
        generateUserMessage(userMessage)
    ]

}