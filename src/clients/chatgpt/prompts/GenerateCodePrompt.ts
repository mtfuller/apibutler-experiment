import { BasePrompt, generateSystemMessage, generateUserMessage, Message } from "./BasePrompt";

const systemMessage = generateSystemMessage(`
Act as a AI that can generate new code, based on instructions written in 
JSON format. You will be given a JSON object and you will need to convert 
it into an appropriate JavaScript file.

Example:
\`\`\`json
{
    "ACTION": "CREATE_FILE",
    "TYPE": "CONTROLLER",
    "NAME": "EmployeeController.js",
    "ENDPOINT": "/employees"
}
\`\`\`
Output:
\`\`\`javascript
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
\`\`\`

Example:
\`\`\`json
{
    "ACTION": "CREATE_FILE",
    "TYPE": "DOCKERFILE",
    "NAME": "Dockerfile"
}
\`\`\`
Output:
\`\`\`dockerfile
FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
\`\`\`

Example:
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
Output:
\`\`\`javascript
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
`);

export default (userMessage: string): BasePrompt => {
    return [
        systemMessage,
        generateUserMessage(userMessage)
    ]
}