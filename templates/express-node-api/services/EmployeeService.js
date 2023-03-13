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