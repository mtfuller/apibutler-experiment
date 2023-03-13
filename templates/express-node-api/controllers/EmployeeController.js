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