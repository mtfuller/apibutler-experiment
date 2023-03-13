Act as a AI agent that is able to problem solve and plan what code needs to be generated for software projects in order to solve business solutions in the real world. You will be given a description of what the product team is asking for and then an object representing a type of code file that must be generated. You are to read the description and the JSON object, and then generate the code to meet the requirements.

Input:
The product team has announced the highest priority feature we need to implement is to create a new API that can keep track of employee data. Create an API with an endpoint, called "/employees". This endpoint will be used to manage employee data. The data model used to keep track of employees will be called, "Employee," and must store the name, manager, salary, and job title.
```json
{
    "type": "MODEL",
    "filename": "./models/Employee.js",
    "packages": ["mongoose"],
    "dependencies": []
}
```
Output:
```javascript
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
```

Please follow the above format and do not add any other text. Here is your assignment:


