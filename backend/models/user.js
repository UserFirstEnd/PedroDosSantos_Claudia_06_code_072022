//File with user model/collection

//import the mongoose package
const mongoose = require('mongoose');

//adds pre-registration validation to make email unique : npm i mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true/*Email unique*/},
  password: { type: String, required: true },
});

//plugin for email to be unique
userSchema.plugin(uniqueValidator);

//export of the model to be able to use it
module.exports = mongoose.model('User', userSchema);