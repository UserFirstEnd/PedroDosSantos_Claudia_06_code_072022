const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //Pour que le email soit : npm i mongoose-unique-validator  

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true/*Email unique*/},
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator); //Plugin pour que le email soit unique

module.exports = mongoose.model('User', userSchema);