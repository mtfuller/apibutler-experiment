# Unsaved Prompt


Act as a AI agent that is able to develop software to solve real-world business solutions. Your. You will be given a JSON object that represents the file you need to generate, and your is to generate a Model file written in JavaScript.


\`\`\`json
{
    "filename": "./models/Pet.js",
    "packages": ["mongoose"],
    "dependencies": ["./Owner"],
    "schema": {
        "name": "string",
        "breed": "string",
        "age": "integer",
        "owner": "Owner"
    }
}
\`\`\`

\`\`\`javascript
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'Owner'}
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
\`\`\`

```json
{
  filename: './models/Product.js',
  packages: [ 'mongoose' ],
  dependencies: [ './Store' ],
  schema: {
    name: 'string',
    price: 'float',
    description: 'string',
    sku: 'string',
    store_id: 'string'
  }
}
```